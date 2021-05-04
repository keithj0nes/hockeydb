import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { SketchPicker } from 'react-color';
import { DashPageHeader, Button, ColorPicker } from '../../../components';

const initState = {
    hasBeenSubmitted: false,
    hasEstimatedAmount: false,
    stripePercentage: 2.9,
    stripeCents: 0.30,
    additionalPercentage: 0,
    additionalCents: 0.0,

    singlePrice: 0,
    singleStripeFees: 0,
    singlePMLFees: 0,
    singleCombinedFees: 0,
    singleIncomeForLeague: 0,
    singleToGetDesiredPrice: 0,

    seasonPrice: 0,
    seasonStripeFees: 0,
    seasonPMLFees: 0,
    seasonCombinedFees: 0,
    seasonIncomeForLeague: 0,
};

const DashHome = () => {
    const [state, setState] = useState(initState);
    const [color, setColor] = useState('#FFFFFF');
    const [colorPickerOpen, setcolorPickerOpen] = useState(false);
    const pageHeaderInfo = {
        title: 'Dashboard',
        hideSearchAndButtons: true,
    };


    const stripeCalculator = (values) => {
        // console.log(values, 'valuesss')
        const { total_price = 0, additional_percentage = 0, additional_cents = 0, estimated_transactions = 0 } = values;

        if (!total_price) return;
        const stripeFees = {
            // p: 0.029,
            // c: 0.30,
            p: state.stripePercentage / 100,
            c: state.stripeCents, // / 100,
        };


        const pRate = additional_percentage ? stripeFees.p + (parseFloat(additional_percentage.toString().replace(/[^0-9.]/g, ''), 10) / 100) : stripeFees.p;
        const cRate = additional_cents ? stripeFees.c + (parseFloat(additional_cents.toString().replace(/[^0-9.]/g, ''), 10) / 100) : stripeFees.c;

        const val = parseFloat(total_price.toString().replace(/[^0-9.]/g, ''), 10);
        const totalRate = (val * pRate) + cRate;
        const stripeFeeTotals = ((val * stripeFees.p) + stripeFees.c).toFixed(2);

        const totalFees = numberWithCommas(totalRate.toFixed(2));
        const totalMinusFees = numberWithCommas((val - (totalRate)).toFixed(2));
        const asked = val + totalRate + (totalRate) * pRate + ((totalRate) * pRate) * pRate + (((totalRate) * pRate) * pRate) * pRate + ((((totalRate) * pRate) * pRate) * pRate) * pRate;

        const totalShouldAsk = numberWithCommas(asked.toFixed(2));
        const totalAfterSubtractingStripeFees = totalFees - stripeFeeTotals;


        setState({
            ...state,
            additionalPercentage: parseFloat(additional_percentage.toString().replace(/[^0-9.]/g, ''), 10),
            additionalCents: parseFloat(additional_cents.toString().replace(/[^0-9.]/g, ''), 10),

            singlePrice: val.toFixed(2),
            singleStripeFees: stripeFeeTotals,
            singlePMLFees: totalAfterSubtractingStripeFees.toFixed(2),
            singleCombinedFees: totalFees,
            singleIncomeForLeague: totalMinusFees,
            singleToGetDesiredPrice: totalShouldAsk,
            hasBeenSubmitted: true,
            hasEstimatedAmount: !!estimated_transactions,
            seasonPrice: numberWithCommas((val * estimated_transactions).toString()),
            seasonStripeFees: numberWithCommas((stripeFeeTotals * estimated_transactions).toFixed(2)),
            seasonPMLFees: numberWithCommas((totalAfterSubtractingStripeFees * estimated_transactions).toFixed(2)),
            seasonCombinedFees: numberWithCommas((totalFees * estimated_transactions).toFixed(2)),
            seasonIncomeForLeague: numberWithCommas((totalMinusFees * estimated_transactions).toFixed(2)),
        });

        // console.log({
        //     single_price: val.toFixed(2),
        //     single_stripe_fees: stripeFeeTotals,
        //     single_pml_fees: totalAfterSubtractingStripeFees.toFixed(2),
        //     single_stripe_and_pml_fees: totalFees,
        //     single_income_for_league: totalMinusFees,
        //     single_to_get_desired_price: totalShouldAsk,
        //     _________________________________________: '',
        //     season_overall_total: numberWithCommas((val * estimated_transactions).toString()),
        //     season_stripe_fees_total: numberWithCommas((stripeFeeTotals * estimated_transactions).toFixed(2)),
        //     season_pml_fees_total: numberWithCommas((totalAfterSubtractingStripeFees * estimated_transactions).toFixed(2)),
        //     season_stripe_and_pml_fees_total: numberWithCommas((totalFees * estimated_transactions).toFixed(2)),
        //     season_income_for_league: numberWithCommas((totalMinusFees * estimated_transactions).toFixed(2)),
        // });
    };

    function numberWithCommas(n) {
        const parts = n.toString().split('.');
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? `.${parts[1]}` : '');
    }

    // eslint-disable-next-line react/prop-types
    const card = ({ title, number, prefix, suffix }) => (
        <div style={{ display: 'flex', margin: '15px 0', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', height: 150, width: 230, padding: 12, background: '#ebebeb', borderRadius: 5 }}>
            <p>{title}:</p>
            <p style={{ fontSize: 34 }}>{prefix}{number}{suffix}</p>
        </div>
    );
    // console.log({stripeCents: state.stripeCents, additionalCents: state.additionalCents});
    // console.log((state.stripeCents) + (state.additionalCents / 100));

    const inlineStyles = {
        colorPickerPopover: {
            position: 'absolute',
            zIndex: '1000',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };
    return (
        <>
            <DashPageHeader pageHeaderInfo={pageHeaderInfo} />

            {/* <button id="bt" onClick={() => setcolorPickerOpen(true)}>OPN PICKER</button> */}

            {/* <ColorPicker onSubmit={e => console.log(e)} /> */}

            {/* {colorPickerOpen && (
                // <div style={inlineStyles.colorPickerPopover}>
                //     <h2 onClick={() => setcolorPickerOpen(false)} style={{color: 'red'}}>close</h2>
                <ColorPicker
                    onSubmit={e => console.log(e)}
                    // hexCode={this.props.color || '#aaa'}
                    // colors={colorPickerColors}
                    // onChange={(color) => {
                    //     this.handleChange('color', color.hex.slice(1));
                    // }}
                    onClose={setcolorPickerOpen}
                />
                // </div>
            )} */}

            {/* <SketchPicker
                color={color}
                onChangeComplete={color => setColor(color.hex)}
                // disableAlpha
                presetColors={[{ color: '#f00', title: 'red' }, { color: '#ffa', title: 'meh' }]}
            />

            <p>{color}</p>

            <div style={{ height: 100, width: 200, background: color }} /> */}

            <Form
                layout="vertical"
                style={{ maxWidth: 500, margin: '40px auto' }}
                onFinish={stripeCalculator}
            >
                <h2>How to use Season Calculator:</h2>
                <p>Enter a Season Price to calculate the total season price minus Stripe and PML (us) fees. Stripe fees are required by default while PML fees are optional and added on top of the Stripe fees. Use the Estimated Transaction box to multiply each category to an overall season count - IE: fees are $100 and there are 50 people in the league, use the Estimated Transation box to view the overall pricing for 50 people in the league.</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                    <Form.Item label="Season Price" name="total_price" style={{ width: '48%' }}>
                        <Input placeholder="Enter Price" />
                    </Form.Item>

                    <Form.Item label="Estimated Transactions" name="estimated_transactions" style={{ width: '48%' }}>
                        <Input placeholder="Enter Transations Count" />
                    </Form.Item>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                    <Form.Item label="Additional Percentage" name="additional_percentage" style={{ width: '48%' }}>
                        <Input placeholder="Enter Percentage" />
                    </Form.Item>

                    <Form.Item label="Additional Cents" name="additional_cents" style={{ width: '48%' }}>
                        <Input placeholder="Enter Cents" />
                    </Form.Item>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button htmlType="submit" title="Calculate" type="admin" />
                </div>

                <div style={{ marginTop: 40 }} />

                <div style={{ width: '33%', float: 'left', textAlign: 'center' }}>
                    <p style={{ fontSize: 20 }}>Stripe Rate:</p>
                    <p style={{ fontSize: 15 }}>{state.stripePercentage}% + {state.stripeCents.toFixed(2)}c</p>
                </div>

                <div style={{ width: '33%', float: 'left', textAlign: 'center' }}>
                    <p style={{ fontSize: 20 }}>Additional Rate:</p>
                    <p style={{ fontSize: 15 }}>{state.additionalPercentage}% + {state.additionalCents}c</p>
                </div>

                <div style={{ width: '33%', float: 'left', textAlign: 'center' }}>
                    <p style={{ fontSize: 20 }}>Total Rate:</p>
                    <p style={{ fontSize: 15 }}>{state.stripePercentage + state.additionalPercentage}% + {(state.stripeCents + (state.additionalCents / 100)).toFixed(2)}c</p>
                </div>

                {/* <p>Stripe Rate: {state.stripePercentage}% + {state.stripeCents.toFixed(2)}c</p>
                <p>Additional Rate: {state.additionalPercentage}% + {state.additionalCents}c</p>
                <p>Total Rate: {state.stripePercentage + state.additionalPercentage}% + {(state.stripeCents + (state.additionalCents / 100)).toFixed(2)}c</p> */}
                <p style={{ clear: 'both', paddingTop: 12 }}>To get the full amount entered in the input above, enter: ${state.singleToGetDesiredPrice}</p>

                <div style={{ marginTop: 40 }} />


                {/* {state.hasBeenSubmitted && (
                    <>
                        <p>Total Stripe Fees: {state.singleStripeFees}</p>
                        <p>Total PML Fees: {state.singlePMLFees}</p>
                        <p>Total Combined Fees: {state.singleCombinedFees}</p>
                        <p>Total League Income: {state.singleIncomeForLeague}</p>
                        <p>To get the amount entered in the input above, enter: {state.singleToGetDesiredPrice} </p>
                    </>
                )} */}

                {state.hasBeenSubmitted && (
                    <>
                        <h3>Single Participant Totals</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {card({ title: 'Total Stripe Fees', number: state.singleStripeFees, prefix: '$' })}
                            {card({ title: 'Total PML Fees', number: state.singlePMLFees, prefix: '$' })}
                            {card({ title: 'Total Combined Fees', number: state.singleCombinedFees, prefix: '$' })}
                            {card({ title: 'Total League Income', number: state.singleIncomeForLeague, prefix: '$' })}
                            {/* {card({ title: 'Total Stripe Fees', number: state.singleStripeFees })} */}
                            {/* {card({ title: 'To get the amount entered in the input above', number: state.singleToGetDesiredPrice, prefix: '$' })} */}
                        </div>


                    </>
                )}

                {state.hasEstimatedAmount && (
                    <>
                        <h3>Overall Season Totals</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {card({ title: 'Overall Stripe Fees', number: state.seasonStripeFees, prefix: '$' })}
                            {card({ title: 'Overall PML Fees', number: state.seasonPMLFees, prefix: '$' })}
                            {card({ title: 'Overall Combined Fees', number: state.seasonCombinedFees, prefix: '$' })}
                            {card({ title: 'Overall League Income', number: state.seasonIncomeForLeague, prefix: '$' })}
                        </div>
                    </>
                )}

            </Form>

        </>
    );
};

export default DashHome;
// stripeCalculator({ amount: '100', percentage: 0.6, cents: 20, estimatedTransactions: 500 })
