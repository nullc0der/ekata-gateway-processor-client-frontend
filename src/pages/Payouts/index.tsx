import { useEffect } from 'react'
import {
    Container,
    TableHead,
    TableRow,
    TableCell,
    TableSortLabel,
    TableContainer,
    Table,
    TableBody,
    Box,
    Paper,
    Typography,
} from '@mui/material'
import { format } from 'date-fns'
import { useMatomo } from '@datapunt/matomo-tracker-react'

import PageHeader from 'components/PageHeader'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { getPayouts } from 'api/payout'
import { updatePayoutDatas } from 'store/payoutSlice'

// TODO: Add payout search/filter

const headCells = [
    {
        id: 'currencyName',
        numeric: false,
        disablePadding: false,
        label: 'Currency',
    },
    {
        id: 'amount',
        numeric: true,
        disablePadding: false,
        label: 'Amount',
    },
    {
        id: 'txids',
        numeric: false,
        disablePadding: false,
        label: 'Tx IDs',
    },
    {
        id: 'forPayments',
        numeric: false,
        disablePadding: false,
        label: 'For Payments',
    },
    {
        id: 'createdOn',
        numeric: false,
        disablePadding: false,
        label: 'Created On',
    },
]

function PayoutTableHead() {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}>
                        <TableSortLabel>{headCell.label}</TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

const Payouts = () => {
    const payouts = useAppSelector((state) => state.payouts.payoutDatas)
    const dispatch = useAppDispatch()
    const { trackPageView } = useMatomo()

    useEffect(() => {
        trackPageView({})
    }, [trackPageView])

    useEffect(() => {
        getPayouts().then((response) => {
            if (response.ok && response.data) {
                dispatch(updatePayoutDatas(response.data))
            }
        })
    }, [dispatch])

    return (
        <Container maxWidth="lg">
            <PageHeader />
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    {!!payouts.length ? (
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle">
                                <PayoutTableHead />
                                <TableBody>
                                    {payouts.map((payoutData, index) => (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={index}>
                                            <TableCell>
                                                {payoutData.currency_name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {payoutData.amount}
                                            </TableCell>
                                            <TableCell>
                                                {payoutData.tx_ids}
                                            </TableCell>
                                            <TableCell>
                                                {payoutData.payout_processed_for_payments.map(
                                                    (x, i) => (
                                                        <Typography
                                                            key={i}
                                                            variant="body2">
                                                            {x}
                                                        </Typography>
                                                    )
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    payoutData.created_on
                                                        ? new Date(
                                                              payoutData.created_on
                                                          )
                                                        : new Date(),
                                                    'dd/MM/Y hh:mm a'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                It seems there is no payouts processed yet,
                                check back later
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    )
}

export default Payouts
