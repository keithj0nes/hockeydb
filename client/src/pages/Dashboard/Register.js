import React, { useState } from 'react';
import { Layout, Menu, Drawer, Steps } from 'antd';
import logo from 'assets/images/logo.png';
import { Site_Name_Full } from '../../assets/resourceStrings';
import '../../assets/styles/register.scss';


const STEPS = {
    Info: 'A description about the Info step',
    Waivers: 'A description about the Waivers step',
    Payment: 'A description about the Payment step',
    Confirmation: 'A description about the Confirmation step',
};

const registeringForSeason = {
    season_id: 245,
    season_name: 'Spring 2024',
};


const Register = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const renderStepTitle = () => {
        const stepVals = Object.values(STEPS);

        return (
            <div>
                <h2 style={{ color: 'white' }}>Step {currentStep + 1}</h2>
                <p style={{ color: 'white' }}>{stepVals[currentStep]}</p>
            </div>
        );
    };

    const renderForm = () => {
        switch (currentStep) {
        case 0:
            return <Page1 />;
        case 1:
            return <Page2 />;
        default:
            return null;
        }
    };

    return (
        <Layout className="dashboard-container">
            <div className="register-container">
                <div className="register-steps-menu">
                    {/* <div className="dashboard-nav-header2">
                        <img src={logo} alt={`${Site_Name_Full} Logo`} className="m-r-s" />
                        <div>
                            <h2>{Site_Name_Full}</h2>
                            <p>{currentSeason?.name || 'No season selected'}</p>
                        </div>
                    </div> */}

                    {renderStepTitle()}

                    {/* <Steps direction="horizontal" size="small" current={2} className="register-steps">
                        <Steps.Step title="Finished" description="This is a description." />
                        <Steps.Step title="In Progress" description="This is a description." />
                        <Steps.Step title="Waiting" description="This is a description." />
                    </Steps> */}

                    <Steps direction="vertical" size="small" current={currentStep} className="register-steps">
                        <Steps.Step title="Info" />
                        <Steps.Step title="Waivers" />
                        <Steps.Step title="Payment" />
                        <Steps.Step title="Confirmation" />
                    </Steps>

                    {/* <div className="hide-desktop" style={{ minHeight: 100, borderBottom: '1px solid gray', marginBottom: 24 }}>
                        <Steps className="hide-desktop register-steps" current={2}>
                            <Steps.Step title="Info" />
                            <Steps.Step title="Waivers" />
                            <Steps.Step title="Payment" />
                            <Steps.Step title="Confirmation" />
                        </Steps>
                    </div> */}
                </div>


                <div>

                    <p>A bunch of content will go here</p>


                    {renderForm()}


                    <button type="button" onClick={() => setCurrentStep((currentStep >= 1 && currentStep - 1) || 0)}>Back</button>

                    <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>Next</button>
                </div>

            </div>


        </Layout>
    );
};

export default Register;


const Page1 = () => (
    <h2>Page 1</h2>
);

const Page2 = () => (
    <h2>Page 2</h2>
);
