import React, { Component } from "react";
import Modal from "react-responsive-modal";
import './Share.css';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import AuthService from '../../AuthService/AuthService'
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { backEnd } from '../../config';

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center",
    rder: 'solid'
};



const butt = {
    width: "80%",
    height: "40px",
    fontWight: "bold",
    marginLeft: "20px",
    marginTop: "20px",
    fontSize: "15px",
}

class Share extends React.Component {
    constructor(props) {
        super(props)
        this.Auth = new AuthService()
    }
    state = {
        open: false,
        popup: true,
        userShare: ''
    };

    componentDidMount() {

    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };


    handleChange = (e) => {
        let x = e.target.name

        this.setState(
            {
                [x]: e.target.value
            }

        )
    }


    shareAmongUsers = () => {
        // console.log("this is user", this.state.userShare)
        // console.log("this is question", this.props.que)
        // console.log("this is id", this.props.qid)

        this.Auth.fetch(backEnd + 'sharequestion', {
            method: 'POST', body: JSON.stringify({
                qid: this.props.qid,
                name: this.state.userShare
            })
        }).then(res => {
            // console.log("sharing success ")
            this.setState({ open: false });
            this.setState()
        })
            .catch(err => {
                // console.log('sharing error', err)
            })


    }


    render() {
        const { open } = this.state;
        let persons = null;
        var menu = ''

        persons = (

            <div className="SHQues" >
                <div className="SHQuestop" style={{ marginLeft: 20 }}>
                    <span>Share Among User</span>
                </div><hr />

                <form className='SHformdiv' noValidate autoComplete="off">
                    <br />
                    <div style={{ width: "100%", marginBottom: 19 }}>

                        <p>Question: <b>{this.props.que}</b></p>
                    </div>
                    <div style={{ width: "80%", margin: 'auto', marginTop: 30 }}>
                        <input type="text" style={{ width: "90%", height: 40, borderRadius: 20, margin: 'auto', outline: 'none', textIndent: 15 }} placeholder="please enter correct username" name="userShare" onChange={this.handleChange} required></input>
                    </div>
                    <br /><br />
                    <div className='SHsubmit' >
                        <Button variant="outline-primary" className="SPB" onClick={this.shareAmongUsers} >Share</Button>
                    </div>
                </form>
            </div>
        )


        return (
            <div>
                <Button className="add_but" style={{ backgroundColor: '#0069D9', color: 'white', paddingTop: 0, paddingBottom: 0, marginTop: 0, height: 25, fontSize: 14, marginLeft: 10 }} onClick={this.onOpenModal}>Share</Button>
                {/* <a href="#" variant="outlined" color="primary" onClick={this.onOpenModal}>Login or Register */}
                {/* </a> */}
                <Modal open={open} onClose={this.onCloseModal} center>
                    {persons}
                </Modal>

            </div>
        );
    }

}




export default Share