import {
    Box,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Grid,
} from '@mui/material'

import BasicCard from 'components/BasicCard'
import { PayoutAddressData } from 'store/payoutAddressSlice'
import { ALLOWED_CURRENCY } from 'appconstants'

interface PayoutAddressListProps {
    payoutAddresses: PayoutAddressData[]
    selectedPayoutAddress?: PayoutAddressData
    onClickPayoutAddress: (payoutAddress: PayoutAddressData) => void
    toggleCreateNewForm: () => void
}

const PayoutAddressList = ({
    payoutAddresses,
    selectedPayoutAddress,
    onClickPayoutAddress,
    toggleCreateNewForm,
}: PayoutAddressListProps) => {
    return (
        <BasicCard>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <List disablePadding>
                    {payoutAddresses.map((x, i) => (
                        <ListItem
                            key={i}
                            disablePadding
                            selected={
                                selectedPayoutAddress
                                    ? selectedPayoutAddress.id === x.id
                                    : false
                            }
                            sx={{ borderRadius: 2, my: 1 }}>
                            <ListItemButton
                                sx={{ borderRadius: 2 }}
                                onClick={() => onClickPayoutAddress(x)}>
                                <ListItemText
                                    primary={x.currency_name}
                                    primaryTypographyProps={{
                                        sx: { textTransform: 'capitalize' },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                {!!(payoutAddresses.length < ALLOWED_CURRENCY.length) && (
                    <Grid container justifyContent="center">
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={toggleCreateNewForm}>
                                Add New
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </BasicCard>
    )
}

export default PayoutAddressList
