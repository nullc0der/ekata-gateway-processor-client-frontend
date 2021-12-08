import { useEffect, useState } from 'react'
import { Container, Grid, Typography, Box } from '@mui/material'
import isEmpty from 'lodash/isEmpty'
import { useMatomo } from '@datapunt/matomo-tracker-react'

import PageHeader from 'components/PageHeader'
import { getPayoutAddresses } from 'api/payoutAddress'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import {
    PayoutAddressData,
    updatePayoutAddresses,
} from 'store/payoutAddressSlice'
import PayoutAddressCreate from './PayoutAddressCreate'
import PayoutAddressList from './PayoutAddressList'
import PayoutAddressUpdate from './PayoutAddressUpdate'

const PayoutAddress = () => {
    const { trackPageView } = useMatomo()
    const payoutAddresses = useAppSelector(
        (state) => state.payoutAddress.payoutAddresses
    )
    const dispatch = useAppDispatch()
    const [selectedPayoutAddress, setSelectedPayoutAddress] =
        useState<PayoutAddressData>()
    const [showCreateNew, setShowCreateNew] = useState(false)
    const [showPayoutAddressList, setShowPayoutAddressList] = useState(true)

    useEffect(() => {
        trackPageView({})
    }, [trackPageView])

    useEffect(() => {
        if (isEmpty(payoutAddresses)) {
            getPayoutAddresses().then((response) => {
                if (response.ok) {
                    dispatch(updatePayoutAddresses(response.data || []))
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setSelectedPayoutAddress(payoutAddresses[payoutAddresses.length - 1])
    }, [payoutAddresses])

    const toggleCreateNewForm = () => {
        if (showCreateNew) {
            setShowCreateNew(false)
        } else {
            setSelectedPayoutAddress(undefined)
            setShowPayoutAddressList(false)
            setShowCreateNew(true)
        }
    }

    const onClickPayoutAddress = (payoutAddresses: PayoutAddressData) => {
        setShowPayoutAddressList(false)
        setSelectedPayoutAddress(payoutAddresses)
    }

    return (
        <Container maxWidth="lg">
            <PageHeader>
                <Typography variant="h6" fontWeight="bold">
                    Payout Addresses
                </Typography>
            </PageHeader>
            {!payoutAddresses.length ? (
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <PayoutAddressCreate initialAddress />
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={5} md={4}>
                        <Box
                            sx={{
                                display: {
                                    xs: showPayoutAddressList
                                        ? 'block'
                                        : 'none',
                                    sm: 'block',
                                },
                            }}>
                            <PayoutAddressList
                                selectedPayoutAddress={selectedPayoutAddress}
                                payoutAddresses={payoutAddresses}
                                onClickPayoutAddress={onClickPayoutAddress}
                                toggleCreateNewForm={toggleCreateNewForm}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={7} md={8}>
                        <Box
                            sx={{
                                display: {
                                    xs: showPayoutAddressList
                                        ? 'none'
                                        : 'block',
                                    sm: 'block',
                                },
                            }}>
                            {!!selectedPayoutAddress && (
                                <PayoutAddressUpdate
                                    payoutAddress={selectedPayoutAddress}
                                    showPayoutAddressList={() =>
                                        setShowPayoutAddressList(true)
                                    }
                                />
                            )}
                            {!!showCreateNew && (
                                <PayoutAddressCreate
                                    toggleCreateNewForm={toggleCreateNewForm}
                                    showPayoutAddressList={() => {
                                        setShowPayoutAddressList(true)
                                        toggleCreateNewForm()
                                    }}
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Container>
    )
}

export default PayoutAddress
