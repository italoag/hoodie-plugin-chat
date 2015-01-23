suite('feed', function () {
  this.timeout(50000);

  suiteSetup(loadUsers);
  suiteSetup(cleanAllPosts);

  test('signIn hommer', function (done) {
    hoodie.account.signIn('Hommer', '123')
      .fail(function (err) {
        done();
        assert.ok(false, err.message);
      })
      .done(function () {
        assert.equal(
          hoodie.account.username,
          'hommer',
          'should be logged in after signup'
        );
        done();
      });
  });

  test('hommer should post', function (done) {
    hoodie.chat.post({text: 'dooh!'})
      .fail(function (err) {
        done(err);
        assert.ok(false, err.message);
      })
      .then(function () {
        assert.ok(true, 'post with success');
        done();
      });
  });

  test('hommer should get post/text feed', function (done) {
    hoodie.chat.feed()
      .fail(done)
      .then(function (task) {
        this.hommerPost = task.chat.feed[0];
        done();
        assert.ok(true, 'feed with success');
      }.bind(this));
  });

  test('hommer should edit post', function (done) {
    var hommerPost = this.hommerPost;
    hommerPost.title = 'D\'oh Homer';
    hommerPost.text = 'Hmm... Donuts!';

    hoodie.chat.updatePost(hommerPost)
      .fail(done)
      .then(function () {
        done();
        assert.ok(true, 'post with success');
      });
  });

  test('lisa should post', function (done) {
    signinUser('Lisa', '123', function () {
      hoodie.chat.post({text: 'i m vegan!'})
        .fail(function (err) {
          done((err.message !== 'conflict') ? err: null);
          assert.ok(false, err.message);
        })
        .then(function (post) {
          assert.ok(true, 'post with success');
          done();
        });
    })
  });


  test('lisa should not edit hommer post', function (done) {
    var hommerPost = this.hommerPost;
    hommerPost.title = 'D\'oh Homer';
    hommerPost.text = 'vegan daddy!!';

    hoodie.chat.updatePost(hommerPost)
      .fail(function () {
        done();
        assert.ok(true, 'post should not edit by lisa');
      })
      .then(function () {
        done();
        assert.ok(false, 'post hould edit only by owner');
      });
  });


  test('lisa should not delete hommer post', function (done) {
    var hommerPost = this.hommerPost;

    hoodie.chat.deletePost(hommerPost)
      .fail(function () {
        done();
        assert.ok(true, 'post should not delete by lisa');
      })
      .then(function () {
        done();
        assert.ok(false, 'post hould delete only by owner');
      });
  });

  test('hommer should get 2 post in his feed', function (done) {
    signinUser('Hommer', '123', function () {
      hoodie.chat.feed()
        .fail(function (err) {
          done(err);
          assert.ok(false, err.message);
        })
        .then(function (feed) {
          done();
          assert.ok(feed.rows.length == 2, 'feed with success');
        });
    })
  });

  test('hommer should get lisa feed', function (done) {
    hoodie.chat.feed('Lisa')
      .fail(function (err) {
        done(err);
        assert.ok(false, err.message);
      })
      .then(function (task) {
        this.lisaPost = task.chat.feed[0];
        done();
        assert.ok(task.chat.feed.length == 1, 'feed with success');
      }.bind(this));
  });


 test('hommer should not edit lisa post', function (done) {
    var lisaPost = this.lisaPost;
    lisaPost.title = 'Lisaaa';
    lisaPost.text = 'vegan?? chamed!';

    hoodie.chat.updatePost(lisaPost)
      .fail(function () {
        done();
        assert.ok(true, 'post should not edit by hommer');
      })
      .then(function () {
        done();
        assert.ok(false, 'post hould edit only by owner');
      });
  });


  test('hommer should not delete lisa post', function (done) {
    var lisaPost = this.lisaPost;

    hoodie.chat.deletePost(lisaPost)
      .fail(function () {
        done();
        assert.ok(true, 'post should not delete by hommer');
      })
      .then(function () {
        done();
        assert.ok(false, 'post hould delete only by owner');
      });
  });

  test('hommer should comment lisa post', function (done) {
    var lisaPost = this.lisaPost;

    hoodie.chat.comment(lisaPost, {text: 'vegan means eat bacon right?!'})
      .fail(done)
      .then(function (task) {
        this.hommerComment = task.chat.comment;
        assert.ok(true, 'comment with success');
        done();
      }.bind(this));
  });

  test('lisa should comment lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Lisa', '123', function () {
      hoodie.chat.comment(lisaPost, {text: 'no daddy bacon is an animal!'})
        .fail(done)
        .then(function (task) {
          this.lisaComment = task.chat.comment;
          assert.ok(true, 'comment with success');
          done();
        }.bind(this));
    }.bind(this));
  });

  test('bart should comment lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Bart', '123', function () {
      hoodie.chat.comment(lisaPost, {text: 'bacon is not animal, right hommer?'})
      .fail(done)
      .then(function () {
        assert.ok(true, 'comment with success');
        done();
      });
    })
  });

  test('homer should comment again lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Hommer', '123', function () {
      hoodie.chat.comment(lisaPost, {text: 'sure bacon is happynes!'})
      .fail(done)
      .then(function () {
        assert.ok(true, 'comment with success');
        done();
      });
    })
  });

  test('homer should like lisa post', function (done) {
    var lisaPost = this.lisaPost;
    hoodie.chat.count(lisaPost, 'like')
      .fail(done)
      .then(function () {
        assert.ok(true, 'comment with success');
        done();
      });
  });


  test('lisa should like lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Lisa', '123', function () {
      hoodie.chat.count(lisaPost, 'like')
      .fail(done)
      .then(function () {
        assert.ok(true, 'comment with success');
        done();
      });
    })
  });


  test('bart should like lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Bart', '123', function () {
      hoodie.chat.count(lisaPost, 'like')
      .fail(done)
      .then(function () {
        assert.ok(true, 'comment with success');
        done();
      });
    })
  });


  test('hommer should unlike lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Hommer', '123', function () {
      hoodie.chat.uncount(lisaPost, 'like')
      .fail(done)
      .then(function () {
        assert.ok(true, 'comment with success');
        done();
      });
    })
  });

  test('cat should like with like lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Cat', '123', function () {
      hoodie.chat.like(lisaPost)
      .fail(done)
      .then(function () {
        assert.ok(true, 'comment with success');
        done();
      });
    })
  });

  test('dog should like with like lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Dog', '123', function () {
      hoodie.chat.like(lisaPost)
      .fail(done)
      .then(function () {
        assert.ok(true, 'comment with success');
        done();
      });
    })
  });

  test('Dog should unlike with unlike lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Dog', '123', function () {
      hoodie.chat.unlike(lisaPost)
      .fail(done)
      .then(function () {
        assert.ok(true, 'comment with success');
        done();
      });
    })
  });

  test('hommer should get lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Hommer', '123', function () {
      hoodie.chat.getPost(lisaPost)
        .fail(done)
        .then(function (task) {
          assert.ok(task.chat.post.countType.like.length === 3, 'comment with success');
          done();
        });
    })
  });

  test('hommer should not update lisa comment', function (done) {
    var lisaPost = this.lisaPost;
    var lisaComment = this.lisaComment;
    signinUser('Hommer', '123', function () {
      hoodie.chat.updateComment(lisaPost, lisaComment)
        .fail(function (err) {
          assert.ok(err, 'comment with success');
          done();
        })
        .then(function () {
          assert.ok(false, 'wrong comment update');
          done();
        });
    })
  });

  test('hommer should not delete lisa comment', function (done) {
    var lisaPost = this.lisaPost;
    var lisaComment = this.lisaComment;
    signinUser('Hommer', '123', function () {
      hoodie.chat.deleteComment(lisaPost, lisaComment)
        .fail(function (err) {
          assert.ok(err, 'comment with success');
          done();
        })
        .then(function () {
          assert.ok(false, 'wrong comment update');
          done();
        });
    })
  });

  test('hommer should update his comment', function (done) {
    var lisaPost = this.lisaPost;
    var hommerComment = this.hommerComment;
    hommerComment.text = 'D\'oh!!!!!!!';
    signinUser('Hommer', '123', function () {
      hoodie.chat.updateComment(lisaPost, hommerComment)
        .fail(done)
        .then(function (task) {
          assert.ok(task.chat.comment.text === hommerComment.text, 'comment with success');
          done();
        });
    })
  });

  test('hommer should delete his comment', function (done) {
    var lisaPost = this.lisaPost;
    var hommerComment = this.hommerComment;
    signinUser('Hommer', '123', function () {
      hoodie.chat.deleteComment(lisaPost, hommerComment)
        .fail(function (err) {
          done(err);
        })
        .then(function () {
          assert.ok(true, 'delete comment with success');
          done();
        });
    })
  });

  test('hommer should share lisa post', function (done) {
    var lisaPost = this.lisaPost;
    signinUser('Hommer', '123', function () {
      hoodie.chat.share(lisaPost)
        .fail(function (err) {
          done(err);
        })
        .then(function () {
          assert.ok(true, 'share post with success');
          done();
        });
    })
  });

});