import React from 'react';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { withRouter } from "react-router";
import qs from 'query-string';
import axios from 'axios';
import './PlanCard.css'

class PlanCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      plan: this.props.plan,
      border: '',
      show: false
    }
  }


  addBorder = () => {
    const planId = qs.parse(this.props.location.search).id
    if (planId == this.props.plan._id) {
      return '3px solid red'
    } else {
      return ''
    }
  }
  handleEdit = event => {
    event.preventDefault();
    this.props.updateEditPlan(this.props.plan._id);
    this.props.history.push({
      pathname: `/create/project/${this.props.plan.project}/plan`,
      search: `id=${this.props.plan._id}`
    })
  }

  handleDelete = event => {
    event.preventDefault();
    axios.delete(`${process.env.REACT_APP_API_URL}/plan/${this.state.plan._id}`)
      .then(res => {
        console.log(res.data)
        this.setState({
          plan: {}
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  handleClick = () => {
    // event.preventDefault();
    console.log(this.state.plan._id)
    this.props.handleSelect(this.state.plan._id)

  }
  handleModal = () => {
    if (this.state.show) {
      this.setState({
        show: false
      })
    } else {
      this.setState({
        show: true
      })
    }
  }

  render() {
    return (
      <Row className="">

        <Col>
          {this.state.plan.price &&
            <>
              <Card onClick={() => {
                if (this.props.match.path == '/project/:projectId/plan/checkout') {
                  this.handleClick()
                }
              }}
                className="detail-show" style={{ border: this.addBorder(), backgroundColor: this.state.show }}>
                <Card.Body>
                  <Card.Title>Pledge US${this.state.plan.price}</Card.Title>
                  <Card.Subtitle className="mt-3 mb-2">{this.state.plan.subtitle}</Card.Subtitle>
                  <Card.Text className="text-muted">{this.state.plan.content}</Card.Text>
                  <div>
                    <small className="text-muted">ESTIMATE DELIVERY</small>
                    <Card.Text>{this.state.plan.estDelivery}</Card.Text>
                  </div>
                  <div>
                    <small className="text-muted">{this.state.plan.backers.length} bakers</small>
                  </div>{(this.props.curUser === this.state.plan.user) && <>
                    <Button variant="outline-dark" onClick={this.handleEdit}>Edit</Button>
                    <Button variant="outline-danger" onClick={this.handleModal}>Delete</Button>
                    <Modal className="modal" show={this.state.show} onHide={this.handleModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Are you Sure?</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>You are trying to delete a plan, are you sure you want to delete?</Modal.Body>
                      <Modal.Footer>
                        <Button className="btn btn-danger" variant="primary" onClick={this.handleDelete}>Delete</Button>
                        <Button variant="secondary" onClick={this.handleModal}>Close</Button>

                      </Modal.Footer>
                    </Modal></>}


                </Card.Body>
              </Card>
            </>}
        </Col>


      </Row>
    )
  }

}




export default withRouter(PlanCard);