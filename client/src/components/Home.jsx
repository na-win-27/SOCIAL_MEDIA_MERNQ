import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";
import PostCard from "./PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "./Postform";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  // console.log(loading, data);
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h2>Recent Posts</h2>
      </Grid.Row>
      <Grid.Row>
        <PostForm />
        {loading ? (
          <h3>LOADING</h3>
        ) : (
          data.getPosts &&
          data.getPosts.map((post) => {
            return (
              <Grid.Column style={{ marginBottom: "30px" }} key={post.id}>
                <PostCard post={post} />
              </Grid.Column>
            );
          })
        )}
      </Grid.Row>
    </Grid>
  );
};

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default Home;
