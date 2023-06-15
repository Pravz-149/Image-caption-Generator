import Replicate from 'replicate';
import { config } from 'dotenv';

config();

export default async function handler(req, res) {
  const replicate = new Replicate({
    auth: "r8_aMKdv2V9bblE50UfN7rhBdT70U4zaV1010Jmr",
  });

  const { image } = req.body;

  const output = await replicate.run(
    'salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746',
    {
      input: {
        image,
      },
    }
  );

  res.status(200).json({ caption: output });
}
