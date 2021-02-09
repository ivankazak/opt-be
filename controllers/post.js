const moment = require('moment');
const { isValidObjectId } = require('mongoose');

const Post = require('../models/Post');
const { uploadS3 } = require('../lib/upload');
const { GeneralError, BadRequest } = require('../lib/error');

const multipleUpload = uploadS3.array('media');

class PostController {
  async getPosts(req, res, next) {
    try {
      const posts = await Post.find();
      return res.status(200).json({ posts });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async createPost(req, res, next) {
    multipleUpload(req, res, async (err) => {
      if (err) {
        return next(new GeneralError('network-error', err.message));
      }

      const media = req.files.map(({ location }) => location);
      const { url, content, corpid, goals } = req.body;

      if (!url) {
        return next(new BadRequest('not-null', "url can't be blank."));
      }

      if (!content) {
        return next(new BadRequest('not-null', "content can't be blank."));
      }

      if (!corpid) {
        return next(new BadRequest('not-null', "corpid can't be blank."));
      }

      if (!goals || goals.length === 0) {
        return next(new BadRequest('not-null', "goals can't be blank."));
      }

      try {
        const { id } = await Post.create({ ...req.body, media });
        return res.status(200).json({ id });
      } catch (error) {
        return next(new GeneralError('database-error', error.message));
      }
    });
  }

  async getPostById(req, res, next) {
    const { postid } = req.params;

    try {
      const post = await Post.findOne({ id: postid });
      return res.status(200).json({ post });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async updatePost(req, res, next) {
    const { id } = req.body;

    if (!id) {
      return next(new BadRequest('not-null', "id can't be blank"));
    }

    try {
      const post = await Post.findOneAndUpdate({ id }, { ...req.body }, { new: true });

      return res.status(200).json({ post });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async deletePost(req, res, next) {
    const { postid } = req.params;

    try {
      await Post.findOneAndDelete({ id: postid });
      return res.status(200);
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }

  async filterPosts(req, res, next) {
    const { corpid, fromdate, tag, todate } = req.query;

    if (corpid && !isValidObjectId(corpid)) {
      return next(new BadRequest('invalid', 'corpid is invalid objectId'));
    }

    try {
      const posts = await Post.find({
        corpid,
        tags: tag,
        createdAt: { $gte: moment(fromdate), $lte: moment(todate) },
      }).populate('goals');
      return res.status(200).json({ posts });
    } catch (err) {
      return next(new GeneralError('database-error', err.message));
    }
  }
}

const postController = new PostController();

module.exports = { postController };
