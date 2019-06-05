const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.db3"
  },
  useNullAsDefault: true
};

const database = knex(knexConfig);

router.get("/", (req, res) => {
  database("zoos")
    .then(zoos => res.status(200).json(zoos))
    .catch(err => res.status(500).json({ success: false, err }));
}); //works

router.get("/:id", (req, res) => {
  database("zoos")
    .where({ id: req.params.id })
    .then(zoos => {
      if (zoos) {
        res.status(200).json(zoos);
      } else {
        res.status(404).json({ message: "That zoo not there brah" });
      }
    })
    .catch(err => res.status(500).json(err));
}); //works

router.post("/", (req, res) => {
  database("zoos")
    .insert(req.body, "id")
    .then(ids => res.status(201).json(ids))
    .catch(err => {
      // console.log(err);
      res.status(500).json({ success: false, err });
    });
}); //works

router.put("/:id", (req, res) => {
  database("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(zoosUpdated => {
      if (zoosUpdated > 0) {
        res.status(202).json(zoosUpdated);
      } else {
        res.status(404).json({ message: "Wow, you dun goofed again!" });
      }
    })
    .catch(err => res.status(500).json({ success: false, err }));
}); //works

router.delete("/:id", (req, res) => {
  database("zoos")
    .where({ id: req.params.id })
    .del()
    .then(zoosDeleted => {
      if (zoosDeleted > 0) {
        res.status(204).json(zoosDeleted);
      } else {
        res
          .status(404)
          .json({ message: "Welp, can't even delete something...sad" });
      }
    })
    .catch(err => res.status(500).json({ success: false, err }));
});

module.exports = router;
