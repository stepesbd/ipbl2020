import React, { useState, useEffect } from 'react'
import { Grid, TextField, Button, Dialog, DialogActions, DialogContent, Select, InputLabel, MenuItem } from '@material-ui/core'
import api from '../../services/api'
import { FormControlStyled } from './styles'

export default function PhysicianUpdate(props) {
    const physicianId = props.id
    const [name, setName] = useState('')
    const [cpf, setCpf] = useState('')
    const [crm, setCrm] = useState('')
    const [type, setType] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [district, setDistrict] = useState('')
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState('')
    const [residential, setResidential] = useState('')
    const [comercial, setComercial] = useState('')
    const [other, setOther] = useState('')
    const [firstSpecialty, setFirstSpecialty] = useState('')
    const [secondSpecialty, setSecondSpecialty] = useState('')

    const [specialties, setSpecialties] = useState([])

    const handleUpdate = async () => {

        const physician = {
            name,
            cpf,
            crm
        }

        await api.put(`physicians/${physicianId}`, physician)

        const address = {
            physicianId: physicianId,
            type,
            zipcode,
            state,
            city,
            district,
            street,
            number
        }

        await api.post(`addresses`, address)

        if (residential !== '') {
            await api.post(`contacts`, {
                physicianId: physicianId,
                type: 'residencial',
                contact: residential
            })
        }

        if (comercial !== '') {
            await api.post(`contacts`, {
                physicianId: physicianId,
                type: 'comercial',
                contact: comercial
            })
        }
        if (other !== '') {
            await api.post(`contacts`, {
                physicianId: physicianId,
                type: 'outros',
                contact: other
            })
        }

        if (firstSpecialty !== '') {
            await api.post(`physicianspecialties`, {
                physicianId: physicianId,
                specialtiesId: firstSpecialty
            })
        }

        if (secondSpecialty !== '') {
            await api.post(`physicianspecialties`, {
                physicianId: physicianId,
                specialtiesId: secondSpecialty
            })
        }

        props.close()
    }

    useEffect(() => {
        if (physicianId !== null) {
            api.get(`profiles/${physicianId}`)
                .then(response => {
                    if (response.data.msg) {
                        const [address] = response.data.msg.addresses
                        const contacts = response.data.msg.contacts
                        const specialties = response.data.msg.specialties
                        setName(response.data.msg.physician.name)
                        setCpf(response.data.msg.physician.cpf)
                        setCrm(response.data.msg.physician.crm)
                        setType(address.type)
                        setZipcode(address.zipcode)
                        setState(address.state)
                        setCity(address.city)
                        setDistrict(address.district)
                        setStreet(address.street)
                        setNumber(address.number)
                        contacts.map(contact => {
                            if (contact.type === 'residencial') {
                                setResidential(contact.contact)
                            } else if (contact.type === 'comercial') {
                                setComercial(contact.contact)
                            } else {
                                setOther(contact.contact)
                            }
                        })
                        if (specialties.length > 0) {
                            setFirstSpecialty(specialties[0].specialtiesId)
                        }
                        if (specialties.length == 2) {
                            setSecondSpecialty(specialties[1].specialtiesId)
                        }
                    }
                }
                )
        } else {
            setName('')
            setCpf('')
            setCrm('')
            setType('')
            setZipcode('')
            setState('')
            setCity('')
            setDistrict('')
            setStreet('')
            setNumber('')
            setResidential('')
            setComercial('')
            setOther('')
            setFirstSpecialty('')
            setSecondSpecialty('')
        }
    }, [physicianId])

    useEffect(() => {
        api.get(`specialties`)
            .then(response => {
                setSpecialties(response.data.msg)
            })
    }, [])

    return (
        <Dialog
            open={props.open}
            onClose={props.close}
            fullWidth={true}
            maxWidth="lg"
        >
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            name="name"
                            label="Nome"
                            value={name}
                            onChange={e => (setName(e.target.value))}
                            fullWidth
                            autoComplete="name"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            name="cpf"
                            label="CPF"
                            value={cpf}
                            onChange={e => (setCpf(e.target.value))}
                            fullWidth
                            autoComplete="cpf"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            name="crm"
                            label="CRM"
                            value={crm}
                            onChange={e => (setCrm(e.target.value))}
                            fullWidth
                            autoComplete="crm"
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <FormControlStyled>
                            <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                            <Select
                                required
                                labelId="demo-simple-select-label"
                                value={type}
                                onChange={e => setType(e.target.value)}
                            >
                                <MenuItem >Selecione</MenuItem>
                                <MenuItem value="local">Local</MenuItem>
                                <MenuItem value="comercial">Comercial</MenuItem>
                                <MenuItem value="outros">Outros</MenuItem>
                            </Select>
                        </FormControlStyled>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            name="zipcode"
                            label="CEP"
                            fullWidth
                            autoComplete="cep"
                            value={zipcode}
                            onChange={e => setZipcode(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            name="state"
                            label="Estado"
                            fullWidth
                            autoComplete="state"
                            value={state}
                            onChange={e => setState(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            name="city"
                            label="Cidade"
                            fullWidth
                            autoComplete="city"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <TextField
                            required
                            name="district"
                            label="Bairro"
                            fullWidth
                            autoComplete="district"
                            value={district}
                            onChange={e => setDistrict(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            name="street"
                            label="Rua"
                            fullWidth
                            autoComplete="street"
                            value={street}
                            onChange={e => setStreet(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <TextField
                            required
                            name="number"
                            label="Número"
                            fullWidth
                            autoComplete="number"
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="residential"
                            label="Contato Residencial"
                            fullWidth
                            autoComplete="residential"
                            value={residential}
                            onChange={e => setResidential(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="comercial"
                            label="Comercial"
                            fullWidth
                            autoComplete="comercial"
                            value={comercial}
                            onChange={e => setComercial(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="other"
                            label="Outros"
                            fullWidth
                            autoComplete="other"
                            value={other}
                            onChange={e => setOther(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlStyled>
                            <InputLabel id="demo-simple-select-label">1º Especialidade</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                value={firstSpecialty}
                                onChange={e => setFirstSpecialty(e.target.value)}
                            >
                                <MenuItem value="0">Selecione</MenuItem>
                                {specialties.map(specialty => (
                                    <MenuItem key={specialty.id} value={specialty.id}>{specialty.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControlStyled>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlStyled>
                            <InputLabel id="demo-simple-select-label">2º Especialidade</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                value={secondSpecialty}
                                onChange={e => setSecondSpecialty(e.target.value)}
                            >
                                <MenuItem value="0">Selecione</MenuItem>
                                {specialties.map(specialty => (
                                    <MenuItem key={specialty.id} value={specialty.id}>{specialty.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControlStyled>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleUpdate}>Alterar</Button>
            </DialogActions>
        </Dialog>
    )
}
