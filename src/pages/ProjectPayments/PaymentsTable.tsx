import { useState, useEffect } from 'react'
import {
    Button,
    TextField,
    Toolbar,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Paper,
    MenuItem,
} from '@mui/material'
import { format } from 'date-fns'

import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { updateProjectPayments } from 'store/projectPaymentsSlice'
import { getProjectsPayment } from 'api/project'
import { ALLOWED_CURRENCY } from 'appconstants'
import TxIDDialog from 'components/TxIDDialog'

interface HeadCell {
    disablePadding: boolean
    id: string
    label: string
    numeric: boolean
}

const headCells: readonly HeadCell[] = [
    {
        id: 'paymentID',
        numeric: false,
        disablePadding: false,
        label: 'Payment ID',
    },
    {
        id: 'currency',
        numeric: false,
        disablePadding: false,
        label: 'Currency',
    },
    {
        id: 'amountRequested',
        numeric: true,
        disablePadding: false,
        label: 'Amount Requested',
    },
    {
        id: 'amountReceived',
        numeric: true,
        disablePadding: false,
        label: 'Amount Received',
    },
    {
        id: 'createdOn',
        numeric: false,
        disablePadding: false,
        label: 'Date',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'txIDs',
        numeric: false,
        disablePadding: false,
        label: 'TX IDs',
    },
]

function PaymentsTableHead() {
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

interface PaymentTableToolbarProps {
    search: string
    currencyName: string
    setSearch: (value: string) => void
    setCurrencyName: (value: string) => void
}

function PaymentTableToolbar({
    search,
    currencyName,
    setSearch,
    setCurrencyName,
}: PaymentTableToolbarProps) {
    return (
        <Toolbar sx={{ py: 2, justifyContent: 'flex-end' }}>
            <TextField
                label="Search by txid/paymentid"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <TextField
                sx={{ width: '150px', ml: 1 }}
                select
                label="Currency"
                value={currencyName}
                onChange={(e) => setCurrencyName(e.target.value)}>
                {ALLOWED_CURRENCY.map((x, i) => (
                    <MenuItem key={i} value={x.toLowerCase()}>
                        {x.toLowerCase()}
                    </MenuItem>
                ))}
            </TextField>
        </Toolbar>
    )
}

interface PaymentsTableProps {
    selectedProjectID: string
}

export default function PaymentsTable({
    selectedProjectID,
}: PaymentsTableProps) {
    const projectPayments = useAppSelector(
        (state) => state.projectPayments.projectPayments
    )
    const dispatch = useAppDispatch()
    const [page, setPage] = useState(0)
    const [txIDs, setTxIDs] = useState<string[]>([])
    const [txIDsForPayment, setTxIDsForPayment] = useState('')
    const [search, setSearch] = useState('')
    const [currencyName, setCurrencyName] = useState('')

    const paymentDatas = projectPayments.payments
    const totalPayments = projectPayments.totalPayments

    useEffect(() => {
        if (search.length && search.length <= 3) return
        getProjectsPayment(
            selectedProjectID,
            25,
            page + 1,
            search,
            currencyName
        ).then((response) => {
            if (response.ok && response.data) {
                dispatch(
                    updateProjectPayments({
                        projectID: selectedProjectID,
                        paymentDatas: response.data.payments,
                        totalPayments: response.data.total_payments,
                    })
                )
            }
        })
    }, [selectedProjectID, dispatch, page, search, currencyName])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const onClickShowTxIDs = (txIDs: string[], paymentID: string) => {
        setTxIDs(txIDs)
        setTxIDsForPayment(paymentID)
    }

    const hideTxIDDialog = () => {
        setTxIDs([])
        setTxIDsForPayment('')
    }

    return !!paymentDatas ? (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <PaymentTableToolbar
                    search={search}
                    currencyName={currencyName}
                    setSearch={setSearch}
                    setCurrencyName={setCurrencyName}
                />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <PaymentsTableHead />
                        <TableBody>
                            {paymentDatas.map((paymentData, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={index}>
                                        <TableCell>
                                            {paymentData.payment_id}
                                        </TableCell>
                                        <TableCell>
                                            {paymentData.currency_name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {paymentData.amount_requested}
                                        </TableCell>
                                        <TableCell align="right">
                                            {paymentData.amount_received}
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                paymentData.created_on
                                                    ? new Date(
                                                          paymentData.created_on
                                                      )
                                                    : new Date(),
                                                'dd/MM/Y hh:mm a'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {paymentData.status}
                                        </TableCell>
                                        <TableCell>
                                            {paymentData.tx_ids?.length && (
                                                <Button
                                                    sx={{
                                                        textTransform:
                                                            'capitalize',
                                                    }}
                                                    onClick={() =>
                                                        onClickShowTxIDs(
                                                            paymentData.tx_ids ||
                                                                [],
                                                            paymentData.payment_id
                                                        )
                                                    }>
                                                    Show tx IDs
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    rowsPerPageOptions={[25]}
                    count={totalPayments}
                    rowsPerPage={25}
                    page={page}
                    onPageChange={handleChangePage}
                />
            </Paper>
            <TxIDDialog
                open={!!txIDs.length}
                title={`Tx IDs for payment ID ${txIDsForPayment}`}
                txIDs={txIDs}
                onClose={hideTxIDDialog}
            />
        </Box>
    ) : null
}
