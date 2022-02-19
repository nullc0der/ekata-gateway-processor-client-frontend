import React, { useEffect, useState } from 'react'
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

import {
    Icon,
    IconButton,
    InputAdornment,
    TextField,
    LinearProgress,
    linearProgressClasses,
    Box,
    Theme,
    Typography,
    Collapse,
} from '@mui/material'
import { TransitionGroup } from 'react-transition-group'

const options = {
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
    },
}

zxcvbnOptions.setOptions(options)

interface EnhancedPasswordFieldProps {
    id: string
    label: string
    error: boolean
    helperText: string
    showPasswordStrength: boolean
    required?: boolean
    fullWidth?: boolean
    name?: string
    onChange: (id: string, value: string) => void
}

interface PasswordFeedback {
    warning: string
    suggestions?: string[]
}

const getPasswordStrengthBarColor = (strength: Number, theme: Theme) => {
    if (strength === 0) {
        return theme.palette.error.dark
    }
    if (strength === 1) {
        return theme.palette.error.light
    }
    if (strength === 2) {
        return theme.palette.warning.dark
    }
    if (strength === 3) {
        return theme.palette.warning.light
    }
    if (strength === 4) {
        return theme.palette.success.main
    }
    return theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
}

const EnhancedPasswordField = (props: EnhancedPasswordFieldProps) => {
    const [value, setValue] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [passwordScore, setPasswordScore] = useState(0)
    const [passwordFeedback, setPasswordFeedback] = useState<PasswordFeedback>()

    const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        props.onChange(event.target.id, event.target.value)
    }

    useEffect(() => {
        if (value && props.showPasswordStrength) {
            const { score, feedback } = zxcvbn(value)
            setPasswordScore(score)
            setPasswordFeedback(feedback)
        }
    }, [value, props.showPasswordStrength])

    return (
        <Box
            sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                width: props.fullWidth ? '100%' : 'auto',
            }}>
            <TextField
                margin="normal"
                id={props.id}
                label={props.label}
                type={showPassword ? 'text' : 'password'}
                required={props.required ?? false}
                fullWidth={props.fullWidth ?? false}
                name={props.name ?? ''}
                value={value}
                error={props.error}
                helperText={props.helperText}
                onChange={onChangeValue}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                onClick={() => setShowPassword(!showPassword)}>
                                <Icon>
                                    {showPassword
                                        ? 'visibility_off'
                                        : 'visibility'}
                                </Icon>
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <TransitionGroup>
                {props.showPasswordStrength && value && (
                    <Collapse>
                        <Typography variant="body2" mt={1}>
                            Password Strength
                        </Typography>
                        <LinearProgress
                            sx={(theme) => ({
                                height: 10,
                                borderRadius: 5,
                                [`&.${linearProgressClasses.colorPrimary}`]: {
                                    backgroundColor:
                                        theme.palette.grey[
                                            theme.palette.mode === 'light'
                                                ? 200
                                                : 800
                                        ],
                                },
                                [`& .${linearProgressClasses.bar}`]: {
                                    borderRadius: 5,
                                    backgroundColor:
                                        getPasswordStrengthBarColor(
                                            passwordScore,
                                            theme
                                        ),
                                },
                            })}
                            variant="determinate"
                            value={((passwordScore + 1) * 100) / 5}
                        />
                        <TransitionGroup>
                            {passwordFeedback?.warning && (
                                <Collapse>
                                    <Typography
                                        variant="subtitle1"
                                        color="grey.600"
                                        component="p">
                                        {passwordFeedback.warning}
                                    </Typography>
                                </Collapse>
                            )}
                            {passwordFeedback?.suggestions &&
                                passwordFeedback.suggestions.map((x, i) => (
                                    <Collapse key={i}>
                                        <Typography
                                            component="p"
                                            variant="subtitle2"
                                            color="grey.500">
                                            {x}
                                        </Typography>
                                    </Collapse>
                                ))}
                        </TransitionGroup>
                    </Collapse>
                )}
            </TransitionGroup>
        </Box>
    )
}

export default EnhancedPasswordField
