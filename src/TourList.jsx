import React from "react";
import "./App.css";
import { get } from "lodash";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { CSVLink } from "react-csv";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Button,
  Container,
  Card,
  Header,
  Dropdown,
  Image
} from "semantic-ui-react";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const TourList = ({ saveTour, businesses, onDragEnd }) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Container style={{ padding: "12px" }}>
      <Header as="h3">Current Tour</Header>
      <Button color="blue" icon="save" onClick={saveTour} />
      <Dropdown className="button icon" icon="download" floating button>
        <Dropdown.Menu>
          <Dropdown.Header icon="tags" content="Download as" />
          <Dropdown.Divider />
          <Dropdown.Item>
            {" "}
            <CSVLink
              data={csvTransformer(businesses)}
              filename={"my-tour.csv"}
              target="_blank"
            >
              CSV
            </CSVLink>
          </Dropdown.Item>
          <Dropdown.Item
            text="PDF"
            onClick={() => pdfMake.createPdf(pdfTransformer(businesses)).open()}
          />
          <Dropdown.Item
            text="JSON"
            onClick={() => downloadAsJson(businesses)}
          />
        </Dropdown.Menu>
      </Dropdown>
      <Container>
        <Droppable droppableId="currentTour">
          {provided => (
            <div
              style={{ paddingTop: "12px" }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Container>
                {businesses.map((business, i) => {
                  return (
                    <Draggable
                      key={business.id}
                      draggableId={business.id}
                      index={i}
                    >
                      {draggableProvided => (
                        <div
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                          ref={draggableProvided.innerRef}
                        >
                          <Card fluid>
                            <Card.Content>
                              <Image
                                // height={50}
                                // width={50}
                                floated="left"
                                size="tiny"
                                alt={business.image_url}
                                src={business.image_url}
                                // style={{ float: "right" }}
                              />
                              <Card.Header>{business.name}</Card.Header>
                              <Card.Meta>{business.display_phone}</Card.Meta>
                              <Card.Meta>
                                {getDisplayAddress(business)}
                              </Card.Meta>
                            </Card.Content>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </Container>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Container>
    </Container>
  </DragDropContext>
);

const getDisplayAddress = item =>
  get(item, "location.display_address").join(" ");
const csvTransformer = list => {
  return list.map(item => {
    return [item.name, item.display_phone, getDisplayAddress(item)];
  });
};

const downloadAsJson = list => {
  var dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list));
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "my-tour.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const pdfTransformer = list => {
  const formattedList = [];
  list.forEach(item => {
    formattedList.push(item.name);
    formattedList.push(item.display_phone);
    formattedList.push(getDisplayAddress(item));
  });
  return {
    content: formattedList
  };
};

export default TourList;
