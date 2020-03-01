import React, {Component, useState, useEffect} from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import {
    Box,
    Form,
    Flex,
    Field,
    Button,
    BaseStyles,
    Card,
    Textarea, Loader,
} from "rimble-ui";

import { addMembersAction } from 'actions/web3Actions';

const CreateForm = () => {
    const history = useHistory();

    const {
        fundName,
        numberOfPeople,
    } = history.location.state;

    const [formSubmitting, setSubmitting] = useState(false);
    const [formValidated, setFormValidated] = useState(false);
    const [validated, setValidated] = useState(false);
    const [addresses, setAddresses] = useState("");

    const handleAddresses = e => {
        setAddresses(e.target.value);
        validateInput(e);
    };

    const validateInput = e => {
        e.target.parentNode.classList.add("was-validated");
    };

    const validateForm = () => {
        try {
            if (
                addresses.length > 0 &&
                addresses.trim().replace(' ','').split(',').length === parseInt(numberOfPeople)
            ) {
                setValidated(true);
                setFormValidated(true);
            } else {
                setValidated(false);
                setFormValidated(false);
            }
        } catch(e){
            setValidated(false);
            setFormValidated(false);
        }
    };

    useEffect(() => {
        validateForm();
    });

    const handleSubmit = e => {
        e.preventDefault();
        console.log("Submitted valid form");
        setSubmitting(true);
        const addressList = addresses.trim().replace(' ','').split(',');
        addMembersAction(addressList, history);
    };

    return (
        <BaseStyles>
            <Card>
                <h4>Add Members to fund : {fundName}</h4>

                <hr/>

                <Box p={4}>
                    <Box>
                        <Form onSubmit={handleSubmit} validated={formValidated}>
                            <Flex mx={-3} flexWrap={"wrap"}>
                                <Box width={[1, 1, 1]} px={3}>
                                    <Field label="Member addresses (split by a comma ',' sign)" validated={validated} width={1}>
                                        <textarea
                                            style={{width:'100%'}}
                                            required
                                            onChange={handleAddresses}
                                            value={addresses}
                                            placeholder="address1, address2,..."
                                            rows={6}
                                        />
                                    </Field>
                                </Box>
                                <Box width={[1, 1, 1]} mt={20} px={3}>
                                    {!!formSubmitting ?
                                        <Loader size="50px"/>
                                        :
                                        <Button type="submit" disabled={!validated}>
                                            Add Members
                                        </Button>
                                    }
                                </Box>
                            </Flex>
                        </Form>
                    </Box>
                </Box>
            </Card>
        </BaseStyles>
    );
};

class AdminAddMembers extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <CreateForm/>
        );
    }
}

export default withRouter(AdminAddMembers);
