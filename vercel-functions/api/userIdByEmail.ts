import { VercelRequest, VercelResponse } from '@vercel/node';
import { admin } from '../services/fireAdmin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const userRecord = await admin.auth().getUserByEmail(req.query.email as string);

		res.send({ uid: userRecord.uid });
	} catch (e) {
		console.log(e, 'oiii');
	}
}
