const express = require("express");
const router = express.Router();
const Posts = require("../data/db");

//get

router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "the posts information couldn't be retreived" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then(posts => {
      console.log("posts", posts);
      if (!posts.length)
        res
          .status(404)
          .json({ message: "the post with the specified id doesn't exist" });
      else res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: "the post information couldn't be retrieved" });
    });
});

// router.get("/:id/comments", (req, res) => {
//     const { id } = req.params
//     Posts.findPostComments(id)
//         .then(comment => {
//             console.log("comment",comment)
//             if (!comment.length) res.status(404).json({ message: "the post with the specified id doesn't exist" })
//             res.status(200).json(comment)
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(404).json({ error: "The comments information could not be retrieved." })
//         })
// })

router.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  Posts.findCommentById(id)
    .then(data => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ message: "couldnt get the comment" });
    });
});

// post

router.post("/", (req, res) => {
  const data = req.body;
  console.log(data);
  if (!data.contents || !data.title)
    res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for the post" });
  Posts.insert(data)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({
          error: "There was an error while saving the post to the database"
        });
    });
});

router
  .post("/:id/comments", (req, res) => {
    const data = req.body;
    if (!data.text)
      res
        .status(400)
        .json({ errorMessage: "please provide text for the comment" });

    console.log(data);
    const { id } = req.params;
    console.log(id);

    Posts.findById(id)
        .then(post => {
            if (!post) res.status(404).json({ error: "no post found with this id"})
            return post
        })
        .then(post => {
            Posts.insertComment({...req.body, post_id: id })
            .then(id => {
                Posts.findCommentById(id.id)
                    .then(([comment]) => {
                        console.log(comment)
                        res.status(201).json(comment)
                    })
            })
            .catch(err => {
                console.log(err)
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "can't connect"})
        })

 
  })

  

// if (!data.text) res.status(400).json({ errorMessage: "please provide text for the comment" })
// Posts.insertComment(data)
//     .then(newPost => {
//         console.log("new",newPost)
//         if (newPost) {
//             res.status(201).json(newPost)
//         }
//         else res.status(404).json({error: "id not found"})
//     })
//     .catch(err => {
//         console.log(err)
//         res.status(500).json({ error: "There was an error while saving the comment to the database" })
//     })
// })

//put

router.put("/:id", (req, res) => {
  const data = req.body;
  const { id } = req.params;
  console.log(data, "req", id);
  if (!data.title && !data.contents)
    res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for the post" });
  Posts.update(id, data)
    .then(updated => {
      //if id doesn't exist
      if (updated === 0)
        res
          .status(404)
          .json({ message: "the post with the specified id doesn't exist" });
      else res.status(200).json(updated);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "the post information couldn't be modified" });
    });
});

// delete

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(deleted => {
      //if id doesn't exist
      if (deleted === 0)
        res
          .status(404)
          .json({ message: "the post with the specified id doesn't exist" });
      else res.status(200).json(deleted);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "the post coulldn't be removed" });
    });
});

module.exports = router;
