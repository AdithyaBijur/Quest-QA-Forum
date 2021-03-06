import React, { Component } from 'react';
import AuthService from '../../../AuthService/AuthService'
import './AllQuestion.css';
import Chip from '@material-ui/core/Chip';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import AQuestionDetails from '../AQuestionDetails/AQuestionDetails';
import { backEnd } from '../../../config';


class AllQuestion extends Component {
    constructor(props) {
        super(props)
        this.Auth = new AuthService()
        this.state = {
            latest: [],
            showall: true,
            qid: ''
        }
    }

    componentDidMount() {
        // console.log('inside')
        if (this.state.showall === true) {
            this.Auth.fetch(backEnd + 'adminview', {
                method: 'POST', body: JSON.stringify({

                })
            }).then(res => {
                this.setState({ latest: res })
                // console.log('tpp')
            })
                .catch(err => {
                    // console.log('latest', err)
                })
        }

    }
    showques = (id) => {
        this.setState({ qid: id, showall: !this.state.showall })
        // console.log(this.state)
        // console.log('showall')



    }

    render() {
        if (this.state.showall === true) {
            let total = this.state.latest.length
            let lv = this.state.latest.map(lat => {
                let tags = lat.tags.map(l => {
                    return (<Chip
                        label={l}
                        component="a"
                        href=""
                        clickable
                        className="ATAGS"
                        variant="outlined"
                    />
                    )
                })
                if (lat.title === '') {
                    lat.title = "Title is not given by user"
                }
                return (
                    <div>

                        <div className="AQdiv">
                            <div className="AQVUV">
                                <div className="AMAINVUV">
                                    <div className="Avotesdiv">
                                        <div className="ANumberdisplay">
                                            <a>{lat.upvotes}</a>
                                        </div>
                                        <div className="AVtext">
                                            <a href="">Votes</a>
                                        </div>
                                    </div>
                                    <div className="Avotesdiv">
                                        <div className="ANumberdisplay">
                                            <a>{lat.noa}</a>
                                        </div>
                                        <div className="AVtext">
                                            <a href="">Answer</a>
                                        </div>
                                    </div>
                                    <div className="Avotesdiv">
                                        <div className="ANumberdisplay">
                                            <a>{lat.views}</a>
                                        </div>
                                        <div className="AVtext">
                                            <a href="">Views</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="AQTdisplay">
                                <div className="AQQDispkay" onClick={() => this.showques(lat._id)}>
                                    {lat.title}
                                </div>
                                <div className="AQTag">
                                    {tags}
                                </div>
                            </div>
                        </div>
                        <hr className="AHRTAG" />
                    </div>)
            })
            return (
                <div className="AQMAIN">
                    <div className="ASDescri">
                        <h3>{total} Total Questions</h3>
                    </div>
                    <hr />
                    {lv}

                </div>
            );
        }
        else
            return (<AQuestionDetails qid={this.state.qid}></AQuestionDetails>)
    }
}


export default AllQuestion