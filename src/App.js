import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import { find, omitBy } from "lodash";
import ls from "local-storage";
import logo from "./logo.png";
import TourList from "./TourList";
import BusinessList from "./BusinessList";
import {
  Button,
  Icon,
  Image,
  Grid,
  Menu,
  Container,
  Input,
  Dropdown,
  Header
} from "semantic-ui-react";

class App extends Component {
  state = {
    businesses: [],
    params: {
      location: "Los Angeles",
      radius: "",
      term: "",
      sort_by: "best_match",
      categories: "restaurants, All"
    },
    currentTour: [],
    savedTours: []
  };

  componentDidMount() {
    this.setState({
      savedTours: ls.get("savedTours") || []
    });
  }

  search = () => {
    axios
      .get("http://localhost:8080/search", {
        params: omitBy(this.state.params, item => !item),
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then(response => {
        this.setState({
          businesses: response.data.businesses
        });
      });
  };

  setCurrentTour = tour => {
    this.setState({ currentTour: tour });
  };

  onDragEnd = result => {
    const { destination, source } = result;
    const { currentTour } = this.state;
    if (!destination) return;
    if (
      destination.dropableId === source.dropableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newTourList = Array.from(currentTour);
    newTourList.splice(source.index, 1);
    newTourList.splice(destination.index, 0, currentTour[source.index]);
    this.setState({ currentTour: newTourList });
  };

  addToTour = business => {
    const { currentTour } = this.state;
    if (!find(currentTour, o => o.id === business.id))
      this.setState({
        currentTour: [...currentTour, business]
      });
  };

  onSearchParamChange = (param, value) => {
    this.setState({
      params: {
        ...this.state.params,
        [param]: value
      }
    });
  };

  onFilterButtonClick = val => {
    this.setState(
      {
        params: {
          ...this.state.params,
          sort_by: val
        }
      },
      this.search
    );
  };
  saveTour = () => {
    // TODO: add naming to saved tours
    const newSavedTours = [...this.state.savedTours, this.state.currentTour];
    ls.set("savedTours", newSavedTours);
    this.setState({
      savedTours: newSavedTours
    });
  };

  render() {
    const { params, businesses, currentTour, savedTours } = this.state;
    const { term, location, radius, sort_by } = params;
    return (
      <div className="App">
        <AppHeader
          term={term}
          location={location}
          radius={radius}
          search={this.search}
          setCurrentTour={this.setCurrentTour}
          savedTours={savedTours}
          onSearchParamChange={this.onSearchParamChange}
        />
        <Container>
          <Grid>
            <Grid.Column width={10}>
              <FilterContainer
                currentSort={sort_by}
                onFilterButtonClick={this.onFilterButtonClick}
              />
              <BusinessList
                businesses={businesses}
                addToTour={this.addToTour}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <TourList
                onDragEnd={this.onDragEnd}
                businesses={currentTour}
                saveTour={this.saveTour}
              />
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}

const FilterContainer = ({ onFilterButtonClick, currentSort }) => {
  return (
    <div>
      <Header as="h3">Filters</Header>
      <Button.Group>
        <Button
          positive={currentSort === "best_match"}
          onClick={() => onFilterButtonClick("best_match")}
        >
          Name
        </Button>
        <Button.Or text="or" />
        <Button
          positive={currentSort === "distance"}
          onClick={() => onFilterButtonClick("distance")}
        >
          Distance
        </Button>
        <Button.Or text="or" />
        <Button
          positive={currentSort === "rating"}
          onClick={() => onFilterButtonClick("rating")}
        >
          Rating
        </Button>
      </Button.Group>
    </div>
  );
};

// Hack. There should be a better way to do this in the UI
const radiusOptions = [...Array(101).keys()]
  .slice(1)
  .filter(n => n % 5 === 0)
  .map(num => ({
    key: num,
    text: num,
    // Meters to ~miles
    value: num * 1609
  }));
const AppHeader = ({
  term,
  location,
  onSearchParamChange,
  search,
  radius,
  savedTours,
  setCurrentTour
}) => {
  return (
    <Menu>
      <Container>
        <Menu.Item as="a" header>
          <Image size="mini" src={logo} style={{ marginRight: "1.5em" }} />
          Food Tour
        </Menu.Item>
        <div style={{ padding: "12px 12px" }}>
          <Input
            placeholder="Find"
            value={term}
            onChange={e => onSearchParamChange("term", e.target.value)}
          />
          <Input
            placeholder="Near"
            value={location}
            onChange={e => onSearchParamChange("location", e.target.value)}
          />
          <Dropdown
            placeholder="Radius"
            selection
            value={radius}
            onChange={(e, data) => onSearchParamChange("radius", data.value)}
            options={radiusOptions}
          />
          <Button animated onClick={search}>
            <Button.Content visible>Go</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
        </div>
        <Menu.Item position="right">
          <Dropdown item simple text="Saved Tours">
            <Dropdown.Menu>
              {/* TODO:Add named saved tours */}
              {savedTours.map((tour, i) => {
                return (
                  <Dropdown.Item
                    key={i}
                    onClick={() => setCurrentTour(tour)}
                  >{`Tour ${i + 1}`}</Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default App;
