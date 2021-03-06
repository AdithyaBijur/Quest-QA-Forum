import React from "react";
import { render } from "react-dom";
import Modal from "react-responsive-modal";
import Editor from "./Editor"
import Fab from '@material-ui/core/Fab'
import './Question.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import AuthService from '../../AuthService/AuthService'
import axios from 'axios';
import { backEnd } from '../../config';

import { Button } from 'react-bootstrap';
const IMG = require('../../../src/Images/load.gif');

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  rder: 'solid'
};



const butt = {
  width: "80%",
  height: "40px",
  fontWight: "bold",
  marginLeft: "10%",
  marginTop: "20px",
  fontSize: "15px",
}

class QuestionPopup extends React.Component {
  constructor(props) {
    super(props)
    this.Auth = new AuthService()
  }
  state = {
    open: false,
    popup: true,
    community: 'Open',
    Title: '',
    text: '',
    notags: '',
    tags: [],
    addtags: [],
    loading: false,
    results: [],

  };

  componentDidMount() {
    this.getResults()
  }

  getResults = () => {
    this.Auth.fetch(backEnd + 'searchcommunity', {
      method: 'POST', body: JSON.stringify({

        Name: ''
      })
    }).then(res => {
      this.setState({ results: res })
      // console.log(this.state)
    })
      .catch(err => {
        // console.log(err)
      })
  }
  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.submit()
    this.setState({ open: false });
    this.setState({ popup: true });
  };


  onCloseModalD = () => {
    // this.submit()
    this.setState({ open: false });
    // this.setState({ popup: true });
  };

  handleChange = event => {
    // console.log(this.state.age)
    this.setState({ [event.target.name]: event.target.value });
    // console.log(this.state)

  };
  handleChangeEditor = (value, delta, source, editor) => {
    // console.log(this.state)
    console.log(editor.getContents())
    this.setState({ text: value })
    this.setState({ notags: editor.getText(value) })

  }

  getTags = () => {
    // fetch('http://localhost:8000/predict', {
    //   method: 'POST', body: JSON.stringify({

    //     "quest": this.state.Title,

    //   })

    // })
    //   .then(res => {
    //     this.setState({ tags: [res] })
    //     console.log(this.state.tags)
    //   })
    //   .catch(err => console.log('ml', err))
    let q = this.state.Title
    // console.log('q', q)
    axios.post('http://localhost:8000/predict', { "quest": q })
      .then(res => {
        // console.log(res);
        // console.log(res.data);
        res.data.p2 = res.data.p2.replace('[', '')
        res.data.p2 = res.data.p2.replace(']', '')
        res.data.p2 = res.data.p2.replace(/'/g, '')

        let t = res.data.p2.split(',')
        // console.log(t)
        if (t.includes(res.data.p1) || t.includes(' ' + res.data.p1))
          this.setState({ tags: t, loading: false })
        else {
          t.push(res.data.p1)
          this.setState({ tags: t, loading: false })
          // console.log(this.state.tags)
        }
      })

      .catch(err => {
        // console.log('ml', err)
      })
  }

  submit = () => {
    this.Auth.fetch(backEnd + 'addquestion', {
      method: 'POST', body: JSON.stringify({

        "question": this.state.text,
        "title": this.state.Title,
        "comunity": this.state.community,
        "tags": this.state.addtags
      })
    }).then(res => {

      // console.log(this.state)
    })
      .catch(err => {
        // console.log(err)
      })
  }


  switchPopupHandler = () => {
    this.setState({ popup: false });
    // this.getTags()
  }



  removetag = (rmtag) => {

    var lucky = this.state.tags.filter(function (number) {
      return number != rmtag;
    })
    this.setState({ tags: lucky })
    this.setState()
  }


  handleChangearr = (e) => {
    let x = e.target.name
    let value = e.target.value
    let temp = e.target.value.split(',')
    this.setState(
      {
        [x]: temp
      },
      // () => { this.validateField(x, value) }
    )
  }




  render() {
    const { open } = this.state;
    let persons = null;
    var menu = ''
    if (this.state.results.length > 0) {
      menu = this.state.results.map(m => { return (<MenuItem value={m.Name}>{m.Name}</MenuItem>) })
    }
    if (this.state.popup) {
      persons = (

        <div className="Ques">
          <div className="Questop AQS">
            <span>Ask a Question</span>
          </div><hr />

          <form className='formdiv' noValidate autoComplete="off">
            <br />

            <TextField className='title'
              id="outlined-full-width"
              name="Title"
              onChange={this.handleChange}
              // style={{ margin: 8 }}
              placeholder="Enter the Tiltle"
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              className="QMTA"
            />
            <br /><br />

            <Editor placeholder={'Write Something...'} text={this.state.text} onChange={this.handleChangeEditor} />

            <div className='selectdiv'>
              <InputLabel >Select Community</InputLabel>
              <Select
                className='select'
                value={this.state.community}
                inputProps={{
                  name: 'community',

                }}
                onChange={this.handleChange}

              >
                <MenuItem value="Open">
                  <em>Open</em>
                </MenuItem>
                {menu}
              </Select>
            </div>
            <br />
            <br />
            <div className='submit' >
              <Button variant="outline-primary" onClick={this.switchPopupHandler}>Submit Question</Button>
            </div>
          </form>
        </div>





      );
    }
    else {
      var ta = this.state.tags.map(t => {
        if (t !== "none" && this.state.loading === false) {
          return (<Chip
            label={t}
            component="a"
            href=""
            clickable
            onDoubleClick={() => this.removetag(t)}
            className="TAGS"
            variant="outlined"
            style={{ marginTop: 20, marginBottom: 20, marginRight: 10, backgroundColor: '#2196F3', color: 'white' }}
          />

          )
        }
      })


      if (this.state.loading === true) {
        persons = (
          <div className="Ques LoadDiv" style={{}}>
            <div className="Tagsmaindiv" >
              <span style={{ fontWeight: 550, fontSize: 18 }}>Loading.....</span>
            </div><hr />

            <div className="Tagsd" style={{ marginTop: 40, marginLeft: 20 }}>
              <span style={{ fontSize: 16 }}>Loading.....</span>
            </div>
            <div style={{ width: "80%", margin: 'auto', marginTop: 30 }}>
              <div style={{ width: 120, margin: 'auto' }}><img src={IMG} style={{ width: 100, height: 100, margin: 'auto' }} />
              </div>
            </div>
          </div>

        )
      }
      else {
        persons = (
          <div className="Ques QPTAGDIV" style={{}}>
            <div className="Tagsmaindiv" >
              <span style={{ fontWeight: 550, fontSize: 18 }}>Tags for asked Question</span>
            </div><hr />

            <div className="Tagsd" style={{ marginTop: 40, marginLeft: 20 }}>
              <span style={{ fontSize: 16 }}>Tags for that question is</span>
            </div>
            <div style={{ width: "90%", margin: 'auto', border: '0.2px solid black', boxShadow: '0px 0px 5px 5px #F2F2F2', marginTop: 30, height: 54 }}>
              {/* {ta} */}
              <input type="text" name="addtags" placeholder="c++, c, java, .............." onChange={this.handleChangearr} required style={{ width: "98%", height: "50px", marginBottom: 1, textIndent: 10, marginTop: 1, marginLeft: "1%", marginRight: "1%", border: 'none' }} /><br /><br />

            </div>
            <div style={{ margin: 'auto', marginTop: 50 }}>
              <Button className="add_but QPTAGDIVBUT" style={{}} variant="success" onClick={this.onCloseModal}> OK</Button>

            </div>
          </div>

        );
      }
    }
    return (
      <div>
        <Button className="add_but" style={butt} onClick={this.onOpenModal}><b className="addsign">+</b> ASK A QUESTION</Button>
        {/* <a href="#" variant="outlined" color="primary" onClick={this.onOpenModal}>Login or Register */}
        {/* </a> */}
        <Modal open={open} onClose={this.onCloseModalD} center>
          {persons}
        </Modal>

      </div>
    );
  }

}




export default QuestionPopup
