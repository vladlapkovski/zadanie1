import request from 'supertest';
import {app} from '../src/app';

describe('Video API', () => {
  const video = {
    title: 'Video',
    author: 'Author',
    availableResolutions: ['P144'],
    minAgeRestriction: null,
    canBeDownloaded: true,
  };

  it('should return all videos', async () => {
    const res = await request(app).get('/hometask_01/api/videos');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining(video)]));
  });

  it('should return a specific video', async () => {
    const res = await request(app).get('/hometask_01/api/videos/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining(video));
  });

  it('should return 404', async () => {
    const res = await request(app).get('/hometask_01/api/videos/999');
    expect(res.statusCode).toEqual(404);
  });

  it('a new video', async () => {
    const res = await request(app)
      .post('/hometask_01/api/videos')
      .send(video);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining(video));
  });

  it('not create a video with invalid data', async () => {
    const invalidVideo = { ...video, title: '' };
    const res = await request(app)
      .post('/hometask_01/api/videos')
      .send(invalidVideo);
    expect(res.statusCode).toEqual(400);
  });

  it('update video', async () => {
    const updatedVideo = { ...video, title: 'Updated Video' };
    const res = await request(app)
      .put('/hometask_01/api/videos/1')
      .send(updatedVideo);
    expect(res.statusCode).toEqual(204);
    const getRes = await request(app).get('/hometask_01/api/videos/1');
    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body).toEqual(expect.objectContaining(updatedVideo));
  });

  it('no update a video', async () => {
    const invalidVideo = { ...video, title: '', minAgeRestriction: 19 };
    const res = await request(app)
      .put('/hometask_01/api/videos/1')
      .send(invalidVideo);
    expect(res.statusCode).toEqual(400);
  });

  it('delete video', async () => {
    const res = await request(app).delete('/hometask_01/api/videos/1');
    expect(res.statusCode).toEqual(204);
    const getRes = await request(app).get('/hometask_01/api/videos/1');
    expect(getRes.statusCode).toEqual(404);
  });

  it('return 404 for deleting video', async () => {
    const res = await request(app).delete('/hometask_01/api/videos/999');
    expect(res.statusCode).toEqual(404);
  });

  it('delete all data', async () => {
    const res = await request(app).delete('/hometask_01/api/testing/all-data');
    expect(res.statusCode).toEqual(204);
    const getRes = await request(app).get('/hometask_01/api/videos');
    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body.length).toEqual(0);
  });
});