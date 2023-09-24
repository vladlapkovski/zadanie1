import express, {Request, Response} from "express"

export const app = express()

let resolution = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]

interface Videos {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: any[];
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
    availableResolutions: ["P144"]
  }, 

  {
    id: 2, 
    title: "kuchna", 
    author: "kto-to", 
    canBeDownloaded: true, 
    minAgeRestriction: null, 
    createdAt: new Date().toISOString(), 
    publicationDate: new Date(Date.now() + 86400000).toISOString(), 
    availableResolutions: ["P144"]
  }
]


const parserMiddleware = express.json()
app.use(parserMiddleware)


app.get("/hometask_01/api/videos", (req: Request, res: Response) => {
  res.status(200).send(videos)
  return
})

app.get("/hometask_01/api/videos/:videoId", (req: Request, res: Response) => {
    let video = videos.find(v => v.id === +req.params.videoId)

    if (!video) {
      return res.status(404).send()
    }
    
    return res.status(200).send(video)
})

app.delete("/hometask_01/api/videos/:videoId", (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
       if (videos[i].id === +req.params.videoId) {
          videos.splice(i, 1);
          res.status(204).send();
          return;
       }
    } 

    return  res.status(404).send()
})

app.delete("/hometask_01/api/testing/all-data", (req: Request, res: Response) => {     
    videos.length = 0;
    return res.status(204).send();        
})

app.post('/hometask_01/api/videos', (req: Request, res: Response) => {
  interface CreateVideoInputModel {
    title: string;
    author: string;
    availableResolutions?: string[];
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    createdAt?: string;
    publicationDate?: string;
  }

  const { title, author, availableResolutions, canBeDownloaded = false, minAgeRestriction = null, createdAt = new Date().toISOString(), publicationDate = new Date(Date.now() + 86400000).toISOString() } = req.body as CreateVideoInputModel;

  // Check for required fields
  if (!title || !author) {
    res.status(400).json({
      errorsMessages: [
        {
          message: "Title and author are required",
          field: !title ? "title" : "author"
        }
      ]
    });
    return;
  }

  // Check for max length
  if (title.length > 40 || author.length > 20) {
    res.status(400).json({
      errorsMessages: [
        {
          message: "Title or author is too long",
          field: title.length > 40 ? "title" : "author"
        }
      ]
    });
    return;
  }

  // Check for available resolutions
  if (!availableResolutions || availableResolutions.length === 0) {
    res.status(400).json({
      errorsMessages: [
        {
          message: "At least one resolution should be added",
          field: "availableResolutions"
        }
      ]
    });
    return;
  }

  // Check for valid resolutions
 const invalidResolutions = availableResolutions.filter(resolution => !resolution || !resolution.includes(resolution));
  if (invalidResolutions.length > 0) {
    res.status(400).json({
      errorsMessages: invalidResolutions.map(resolution => ({
        message: "Invalid resolution",
        field: "availableResolutions"
      }))
    });
    return;
  }

  // Add new video
  const newVideo: Videos = {
    id: videos.length + 1,
    title,
    author,
    canBeDownloaded,
    minAgeRestriction,
    createdAt,
    publicationDate,
    availableResolutions
  };
  videos.push(newVideo);

  res.status(201).json({ video: newVideo });
});



app.put("/hometask_01/api/videos/:videoId", (req: Request, res: Response) => {
  let video = videos.find(v => v.id === +req.params.videoId)

  if (req.body.title.length > 40 || req.body.author.length > 20 || req.body.availableResolutions.length < 1 || !req.body.availableResolutions.every((r: string) => resolution.includes(r)) || typeof(req.body.canBeDownloaded) !== "boolean" || req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18) {
    res.status(400).send()
    return
  } 

  if(!video){
    res.status(404).send()
      return
  }


  video.title = req.body.title,
  video.author = req.body.author,
  video.availableResolutions = req.body.availableResolutions,
  video.canBeDownloaded = req.body.canBeDownloaded,
  video.minAgeRestriction = req.body.minAgeRestriction,
  video.publicationDate = new Date(Date.now() + 86400000).toISOString()
  
  return res.status(204).send(video)
})