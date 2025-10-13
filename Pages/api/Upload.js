import formidable from 'formidable';
import { nanoid } from 'nanoid';
import clientPromise from '../../lib/mongodb';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error parsing form' });

    const file = files.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Đọc nội dung file thành buffer
    const fs = require('fs');
    const data = fs.readFileSync(file.filepath);

    const id = nanoid(8);
    const token = nanoid(32);

    // Lưu file vào database (dạng buffer)
    const db = (await clientPromise).db();
    await db.collection('pastes').insertOne({
      _id: id,
      filename: file.originalFilename,
      mimetype: file.mimetype,
      data: data, // buffer
      token,
      createdAt: new Date(),
    });

    res.status(200).json({
      rawUrl: `/api/raw/${id}?token=${token}`,
      id,
      token,
    });
  });
}
