let db = {
  screams: [
    {
      userHandle: "user",
      body: "this is the scream body",
      createdAt: "2020-07-17T06:05:03.132Z",
      likeCount: 5,
      commentCount: 2,
    },
  ],
  comments: [
    {
      userHandle: "user",
      screamId: "adsfkjdsfjkfks",
      body: "Comment from dbschema!",
      createdAt: "2020-01-01T10:59:52.798Z",
    },
  ],
};

const userDetails = {
  //Redux data
  credentials: {
    bio: "I love Aisha",
    createdAt: "2020-07-17T22:00:20.205Z",
    email: "user@email.com",
    handle: "user",
    location: "Chicago, IL",
    userId: "sqe0QXpLnnbscThoa6MyQ9CTwy13",
    website: "https://google.com",
  },
  likes: [
    {
      userHandle: "user",
      screamId: "1234567890",
    },
    {
      userHandle: "user",
      screamId: "0987654321",
    },
  ],
};
