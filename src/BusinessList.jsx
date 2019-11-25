import React from "react";
import "./App.css";
import { get } from "lodash";

import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  Button,
  Icon,
  Item,
  Label,
  Container,
  Header,
  Rating
} from "semantic-ui-react";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const BusinessList = ({ loading, businesses, addToTour }) => (
  <Container style={{ padding: "12px" }}>
    <Header as="h3">Results</Header>
    <Item.Group divided>
      {businesses.map(business => {
        return (
          <Item key={business.id}>
            <img
              height={150}
              width={150}
              alt={business.image_url}
              src={business.image_url}
            />

            <Item.Content>
              <Item.Header as="a">{business.name}</Item.Header>
              <Item.Meta>
                <span>{business.display_phone}</span>
              </Item.Meta>
              <Item.Meta>
                <span>
                  {get(business, "location.display_address").join(" ")}
                </span>
              </Item.Meta>
              <Item.Extra style={{ marginTop: "12px" }}>
                {business.price && (
                  <Label circular color="blue">
                    {business.price}
                  </Label>
                )}
                <Rating
                  icon="star"
                  disabled
                  defaultRating={business.rating}
                  maxRating={5}
                />
              </Item.Extra>
              <Item.Extra style={{ marginTop: "12px" }}>
                <Button
                  primary
                  floated="right"
                  onClick={() => addToTour(business)}
                >
                  Add to Tour
                  <Icon name="right chevron" />
                </Button>

                {business.categories.map(cat => (
                  <Label key={cat.title}>{cat.title}</Label>
                ))}
              </Item.Extra>
            </Item.Content>
          </Item>
        );
      })}
    </Item.Group>
  </Container>
);

export default BusinessList;
