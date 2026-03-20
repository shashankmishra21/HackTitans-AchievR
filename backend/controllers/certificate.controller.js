const Certificate = require('../models/Certificate');
const Activity = require('../models/Activity');
const crypto = require('crypto');
const certificateService = require('../services/certificateService');
const { PassThrough } = require('stream');

// Stream → Buffer helper
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const passThrough = new PassThrough();
    readableStream.pipe(passThrough);
    passThrough.on('data', chunk => chunks.push(chunk));
    passThrough.on('end', () => resolve(Buffer.concat(chunks)));
    passThrough.on('error', reject);
  });
}

// AWS 
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.generateCertificate = async (req, res) => {
  let pdfBuffer;
  let s3Key;

  try {
    const { activityId } = req.params;
    const activity = await Activity.findById(activityId)
      .populate('student', 'name email rollNumber department');

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (activity.status !== 'approved') {
      return res.status(400).json({ error: `Activity must be 'approved', current: '${activity.status}'` });
    }

    if (!activity.student) {
      return res.status(400).json({ error: 'Student data missing' });
    }

    // Generate unique certificate
    const certificateId = `CERT_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const verificationCode = crypto.randomBytes(10).toString('hex');
    s3Key = `certificates/${certificateId}.pdf`;

    // Generate PDF
    const result = await certificateService.generateCertificate({
      studentName: activity.student.name,
      achievement: activity.title,
      organizingBody: activity.organizingBody || 'AchievR Platform',
      eventDate: activity.eventDate || new Date().toISOString().split('T')[0],
      achievementLevel: activity.achievementLevel || 'Achievement',
      certificateId,
      rollNo: activity.student.rollNumber,
      department: activity.student.department
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'PDF generation failed' });
    }

    pdfBuffer = result.pdfBuffer; //Store for later use

    // Upload to S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    // console.log('S3 Upload Success:', s3Key);

    // Save to DB
    const certificate = new Certificate({
      certificateId,
      activity: activity._id,
      student: activity.student._id,
      issuedBy: req.user?.userId,
      title: activity.title,
      organizingBody: activity.organizingBody,
      achievementLevel: activity.achievementLevel,
      eventDate: activity.eventDate,
      pdfPath: s3Key,
      s3Bucket: process.env.S3_BUCKET,
      verificationCode,
      status: 'active'
    });
    await certificate.save();

    // Update activity
    await Activity.findByIdAndUpdate(activityId, {
      certificate: certificate._id,
      certificateId,
      status: 'certified',
      certificateGeneratedAt: new Date()
    });

    // Send PDF directly KEEP ORIGINAL BUFFER - no S3 re-download!
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${certificateId}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('s3Key:', s3Key || 'not set');
    console.error('hasPdfBuffer:', !!pdfBuffer);
    console.error('S3_BUCKET:', process.env.S3_BUCKET || 'MISSING');

    res.status(500).json({
      error: error.message,
      s3Key: s3Key || 'not set',
      hasPdfBuffer: !!pdfBuffer,
      s3Bucket: !!process.env.S3_BUCKET
    });
  }
};

exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await Certificate.findOne({ certificateId })
      .populate('student', 'name rollNumber department')
      .populate('activity', 'title organizingBody eventDate achievementLevel');

    if (!cert || cert.status !== 'active') {
      return res.status(404).json({ error: 'Valid certificate not found' });
    }

    // Stream from S3
    const command = new GetObjectCommand({
      Bucket: cert.s3Bucket || process.env.S3_BUCKET,
      Key: cert.pdfPath,
    });

    const s3Object = await s3Client.send(command);
    const pdfBuffer = await streamToBuffer(s3Object.Body);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cert.certificateId}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Download error:', error.message);
    res.status(500).json({ error: 'Download failed' });
  }
};

exports.verifyCertificate = async (req, res) => {

  try {
    const { certificateId } = req.params;
    const cert = await Certificate.findOne({ certificateId })
      .populate('student', 'name rollNumber department email')
      .populate('activity', 'title category organizingBody achievementLevel eventDate')
      .lean();

    if (!cert) {
      return res.status(404).json({
        status: 'not_found',
        message: 'Certificate not found'
      });
    }

    const now = new Date();
    const isValid = cert.status === 'active' &&
      !cert.isRevoked &&
      (!cert.expiresAt || cert.expiresAt > now);

    if (!isValid) {
      return res.status(410).json({
        status: 'invalid',
        message: 'Certificate expired or revoked'
      });
    }

    await Certificate.updateOne(
      { _id: cert._id },
      {
        $inc: { verificationCount: 1 },
        $set: { lastVerifiedAt: now }
      }
    ).exec();

    res.json({
      status: 'valid',
      data: {
        certId: cert.certificateId,
        student: cert.student?.name,
        rollNo: cert.student?.rollNumber,
        department: cert.student?.department,
        achievement: cert.activity?.title,
        category: cert.activity?.category,
        organizer: cert.activity?.organizingBody,
        level: cert.activity?.achievementLevel,
        eventDate: cert.activity?.eventDate,
        issued: cert.issuedAt,
        verifiedCount: cert.verificationCount || 0
      }
    });

  } catch (error) {
    console.error('Verify error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Verification service unavailable'
    });
  }
};

exports.getStats = async (req, res) => {

  try {
    const stats = await Certificate.aggregate([{
      $facet: {
        total: [{ $count: 'count' }],
        active: [{ $match: { status: 'active' } }, { $count: 'count' }],
        revoked: [{ $match: { isRevoked: true } }, { $count: 'count' }],
        today: [{ $match: { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }, { $count: 'count' }]
      }
    }]);

    res.json({
      success: true,
      stats: stats[0] || { total: [{ count: 0 }], active: [{ count: 0 }], revoked: [{ count: 0 }], today: [{ count: 0 }] }
    });

  } catch (error) {
    console.error('Stats error:', error.message);
    res.status(500).json({ error: 'Stats unavailable' });
  }
};