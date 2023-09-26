import express, { Request, Response } from "express";

const app = express();

enum Resolution {
  P144 = "P144",
  P240 = "P240",
  P360 = "P360",
  P480 = "P480",
  P720 = "P720",
  P1080 = "P1080",
  P1440 = "P1440",
  P2160 = "P2160",
}

let resolution: Resolution[] = [
  Resolution.P144,
  Resolution.P240,
  Resolution.P360,
  Resolution.P480,
  Resolution.P720,
  Resolution.P1080,
  Resolution.P1440,
  Resolution.P2160,
];

interface Videos {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: Resolution[];
}

const videos: Videos[] = [
  {
    id: 1,
    title: "nigth show",
    author: "dimych",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(Date.now() + 86400000).toISOString(),
    availableResolutions: [Resolution.P144],
  },
];

const parserMiddleware = express.json();
app.use(parserMiddleware);

app.get("/hometask_01/api/videos", (req: Request, res: Response) => {
  res.status(200).send(videos);
});

app.get("/hometask_01/api/videos/:videoId", (req: Request, res: Response) => {
  let video = videos.find((v) => v.id === +req.params.videoId);

  if (!video) {
    return res.status(404).send();
  }

  return res.status(200).send(video);
});

app.delete("/hometask_01/api/videos/:videoId", (req: Request, res: Response) => {
  for (let i = 0; i < videos.length; i++) {
    if (videos[i].id === +req.params.videoId) {
      videos.splice(i, 1);
      res.status(204).send();
      return;
    }
  }

  return res.status(404).send();
});

app.delete("/hometask_01/api/testing/all-data", (req: Request, res: Response) => {
  videos.length = 0;
  return res.status(204).send();
});

app.put("/hometask_01/api/videos/:videoId", (req: Request, res: Response) => {
  let video = videos.find((v) => v.id === +req.params.videoId);

  if (!video) {
    return res.status(404).send();
  }

  if (
    !req.body.title ||
    typeof req.body.title !== "string" ||
    req.body.title.length > 40
  ) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'invalid title', 
          field: "title"
        }
      ]
    });
  }

  if (
    !req.body.author ||
    typeof req.body.author !== "string" ||
    req.body.author.length > 20
  ) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid author', 
          field: "aurhor"
        }
      ]
    });
  }

  if (
    !req.body.availableResolutions ||
    !Array.isArray(req.body.availableResolutions) ||
    req.body.availableResolutions.length < 1 ||
    !req.body.availableResolutions.every((r: Resolution) =>
      resolution.includes(r)
    )
  ) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid resolutions', 
          field: "availableResolutions"
        }
      ]
    });
  }

  if (typeof req.body.canBeDownloaded !== "boolean") {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid canBeDownloaded', 
          field: "canBeDownloaded"
        }
      ]
    });
  }

  if (
    req.body.minAgeRestriction !== null &&
    (typeof req.body.minAgeRestriction !== "number" ||
      req.body.minAgeRestriction < 1 ||
      req.body.minAgeRestriction > 18)
  ) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid minAgeRestriction', 
          field: "minAgeRestriction"
        }
      ]
    });
  }

  video.title = req.body.title;
  video.author = req.body.author;
  video.availableResolutions = req.body.availableResolutions;
  video.canBeDownloaded = req.body.canBeDownloaded;
  video.minAgeRestriction = req.body.minAgeRestriction;
  video.publicationDate = new Date(Date.now() + 86400000).toISOString();

  return res.status(204).send(video);
});

app.post("/hometask_01/api/videos", (req: Request, res: Response) => {
  if (
    !req.body.title ||
    typeof req.body.title !== "string" ||
    req.body.title.length > 40
  ) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'invalid title', 
          field: "title"
        }
      ]
    });
  }

  if (
    !req.body.author ||
    typeof req.body.author !== "string" ||
    req.body.author.length > 20
  ) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid author', 
          field: "aurhor"
        }
      ]
    });
  }

  if (
    !req.body.availableResolutions ||
    !Array.isArray(req.body.availableResolutions) ||
    req.body.availableResolutions.length < 1 ||
    !req.body.availableResolutions.every((r: Resolution) =>
      resolution.includes(r)
    )
  ) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: 'Invalid resolutions', 
          field: "availableResolutions"
        }
      ]
    });
  }

  const newVideo: Videos = {
    id: videos.length + 1,
    title: req.body.title,
    author: req.body.author,
    canBeDownloaded: req.body.canBeDownloaded || false,
    minAgeRestriction:
    req.body.minAgeRestriction !== undefined ? req.body.minAgeRestriction : null,
    createdAt: req.body.createdAt || new Date().toISOString(),
    publicationDate:
    req.body.publicationDate || new Date(Date.now() + 86400000).toISOString(),
    availableResolutions: req.body.availableResolutions,
  };

  videos.push(newVideo);

  return res.status(201).send(newVideo);
});

app.listen(3000, () => {
console.log("Server is listening on port 3000");
});