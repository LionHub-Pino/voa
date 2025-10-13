import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  const { token } = req.query;

  const db = (await clientPromise).db();
  const paste = await db.collection('pastes').findOne({ _id: id });

  if (!paste) return res.status(404).send('Not found');
  if (paste.token !== token) return res.status(401).send('Unauthorized');

  // Thiết lập header đúng kiểu file
  res.setHeader('Content-Type', paste.mimetype || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${paste.filename}"`);
  res.send(paste.data.buffer); // .buffer nếu data là Binary trong MongoDB
}
