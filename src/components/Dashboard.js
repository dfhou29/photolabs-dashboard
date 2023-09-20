import React, {Component} from "react";
import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import axios from "axios";

import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads
} from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }
];


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      focused: null,
      photos: [],
      topics: []
    }
  }

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({
        focused
      })
    }

    const requests = ['/api/photos', '/api/topics'].map(request => axios.get(request));

    Promise.all(requests)
    .then(([photos, topics]) => {
      console.log('requesting...');
      this.setState({

        photos: photos.data,
        topics: topics.data,
        loading: false
      })
      console.log('request completed');
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused))
    }
  }

  selectPanel = (id) => {
    if (this.state.focused) {
      this.setState({
        focused: null
      });
    } else {
      this.setState({
        focused: id
      });
    }

  }

  renderPanel() {
    return (this.state.focused ? data.filter(item => item.id === this.state.focused) : data)
    .map(item => (
      <Panel key={item.id} label={item.label} value={item.getValue(this.state)} onSelect={() => this.selectPanel(item.id)}/>
    ))
  }


  render() {
    console.log(this.state);
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });
    if (this.state.loading) {
      return (
        <Loading/>
      )
    }
    return (
      <main className={dashboardClasses}>
        {this.renderPanel()}
      </main>
    )
  }
}

export default Dashboard;