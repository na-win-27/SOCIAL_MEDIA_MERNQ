import React from "react";
import { Card, Icon, Label, Image, Button, Container } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

const PostCard = (props) => {
  const { body, createdAt, id, username, likeCount, commentCount, likes } =
    props.post;

  const likePost = () => {
    console.log("like");
  };

  const commentPost = () => {
    console.log("comment");
  };
  return (
    <Container>
      <Card fluid>
        <Card.Content>
          <Image
            floated="right"
            size="mini"
            src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta as={Link} to={`/post/${id}`}>
            {moment(createdAt).fromNow()}
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
          <Card.Meta>{likeCount}</Card.Meta>
          <Card.Meta>{commentCount}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Container>
            <Button
              as="div"
              color="red"
              labelPosition="right"
              style={{ marginLeft: "3px" }}
            >
              <Button color={""} icon onClick={likePost}>
                <Icon name="heart" color="" />
                Like
              </Button>
              <Label as="a" color="red" basic pointing="left">
                {likeCount}
              </Label>
            </Button>
            <Button
              as="div"
              labelPosition="left"
              style={{ marginLeft: "20px" }}
            >
              <Label as="a" basic color="">
                {commentCount}
              </Label>
              <Button icon color="blue" onClick={commentPost}>
                <Icon name="comments" />
                comment
              </Button>
            </Button>
          </Container>
        </Card.Content>
      </Card>
    </Container>
  );
};

export default PostCard;
