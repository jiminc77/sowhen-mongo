import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { _id } = req.body;

  const client = await clientPromise;
  const collection = client.db('user').collection('appointmentTimetable');
  
  await collection.deleteOne({ _id: new ObjectId(_id) });

  res.status(200).json({ message: 'Appointment rejected' });
}