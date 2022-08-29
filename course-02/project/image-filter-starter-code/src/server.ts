import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8080;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */


  app.get("/filteredimage",
    async (req: express.Request, res: express.Response, next) => {
      let image_url : string = req.query.image_url;
      if (image_url){
        await filterImageFromURL(image_url)
          .then((result) => {
            res.sendFile(result, () => {
              deleteLocalFiles([result]);
            });
          })
          .catch((err) => {
            res.status(400).json({ error: err });
          });
      }
      else if(!image_url) {
        res.status(400).json({ error: "empty image request" });
      }
      else{
        res.status(500).json({ error: "server error: could not complete request" });
      }
    }
  );

  // Deployment Link = http://udacity-muriithi-gakuru-ebeanstalk-dev.us-east-1.elasticbeanstalk.com/

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();