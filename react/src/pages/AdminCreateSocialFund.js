import React, {Component, useState, useEffect} from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import {
    Box,
    Form,
    Flex,
    Input,
    Field,
    Button,
    Heading,
    Card,
    Loader,
} from "rimble-ui";

import { deploySocialFundContract } from 'actions/web3Actions';
import {connect} from "react-redux";

const CreateForm = (props) => {
    const history = useHistory();
    const [formValidated, setFormValidated] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formSubmitting, setSubmitting] = useState(false);
    const [fundName, setFundName] = useState("");
    const [numberOfPeople, setNumberOfPeople] = useState("10");
    const [periodTerm, setPeriodTerm] = useState("10");
    const [amount, setAmount] = useState("0");
    const [asset, setAsset] = useState("DAI");

    const handleFundName = e => {
        setFundName(e.target.value);
        validateInput(e);
    };

    const handleNumberOfPeople = e => {
        setNumberOfPeople(e.target.value);
        setPeriodTerm(e.target.value);
        validateInput(e);
    };

    const handlePeriodTerm = e => {
        setPeriodTerm(e.target.value);
        setNumberOfPeople(e.target.value);
        validateInput(e);
    };

    const handleAmount = e => {
        setAmount(e.target.value);
        validateInput(e);
    };

    const handleAsset = e => {
        setAsset(e.target.value);
        validateInput(e);
    };

    const validateInput = e => {
        e.target.parentNode.classList.add("was-validated");
    };

    const validateForm = () => {
        // Perform advanced validation here
        try {
            if (
                fundName.length > 0 &&
                asset.length > 0 &&
                parseInt(numberOfPeople) > 0 &&
                parseInt(periodTerm) > 0 &&
                parseInt(amount) > 0
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
        const contractParams = {
            fundName,
            numberOfPeople,
            periodTerm,
            amount,
            asset,
        };
        console.log(contractParams);
        setSubmitting(true);
        props.deploySocialFundContractAction(contractParams, history);
    };

    return (
            <Card maxWidth={'640px'} mx={'auto'} p={3} px={4} mb={'150px'}>
                <Heading>Create Social Fund</Heading>

                <Box p={4}>
                    <Box>
                        <Form onSubmit={handleSubmit} validated={formValidated}>
                            <Flex mx={-3} flexWrap={"wrap"}>
                                <Box width={[1, 1, 1 / 2]} px={3}>
                                    <Field label="Fund Name" validated={validated} width={1}>
                                        <Input
                                            type="text"
                                            required
                                            onChange={handleFundName}
                                            value={fundName}
                                            width={1}
                                        />
                                    </Field>
                                </Box>
                                <Box width={[1, 1, 1 / 2]} px={3}>
                                    <Field label="Number of People" validated={validated} width={1}>
                                        <Form.Input
                                            type="number"
                                            required
                                            onChange={handleNumberOfPeople}
                                            value={numberOfPeople}
                                            width={1}
                                        />
                                    </Field>
                                </Box>
                                <Box width={[1, 1, 1 / 2]} px={3}>
                                    <Field label="Period Term Length (in months)" validated={validated} width={1}>
                                        <Form.Input
                                            type="number"
                                            required
                                            onChange={handlePeriodTerm}
                                            value={periodTerm}
                                            width={1}
                                        />
                                    </Field>
                                </Box>
                                <Box width={[1, 1, 1 / 2]} px={3}>
                                    <Field label="Monthly Deposit Amount" validated={validated} width={1}>
                                        <Form.Input
                                            type="number"
                                            required
                                            onChange={handleAmount}
                                            value={amount}
                                            width={1}
                                        />
                                    </Field>
                                </Box>
                                <Box width={[1, 1, 1 / 2]} px={3}>
                                    <Field label="Asset code" validated={validated} width={1}>
                                        <Form.Input
                                            type="text"
                                            required
                                            onChange={handleAsset}
                                            value={asset}
                                            width={1}
                                        />
                                    </Field>
                                </Box>
                                <Box width={[1, 1, 1 / 2]} mt={28} px={3}>
                                    {!!formSubmitting ?
                                        <Loader size="50px"/>
                                        :
                                        <Button type="submit" disabled={!validated}>
                                            Submit & Deploy
                                        </Button>
                                    }
                                </Box>
                            </Flex>
                        </Form>
                    </Box>
                </Box>
            </Card>
    );
};

class AdminCreateSocialFund extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <CreateForm {...this.props}/>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    deploySocialFundContractAction: (contractParams, history) => dispatch(deploySocialFundContract(contractParams, history)),
});

const mapStateToProps = ({
    decofiAdminReducer: {
        contracts,
    }
}) => ({
    contracts,
});

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(AdminCreateSocialFund));
