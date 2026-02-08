import ytdl from "ytdl-core"

const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

const run = async () => {
  const info = await ytdl.getInfo(url)
  console.log(info.videoDetails.title)
}

run()
