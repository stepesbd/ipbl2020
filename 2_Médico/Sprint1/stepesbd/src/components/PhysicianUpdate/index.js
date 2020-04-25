import React, { useState, useEffect } from 'react'
import { Grid, TextField, Button, Dialog, DialogActions, DialogContent, Select, InputLabel, MenuItem } from '@material-ui/core'
import api from '../../services/api'
import { FormControlStyled } from './styles'

export default function PhysicianInsert(props) {
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

    const handleInsert = async () => {
        /*console.log({
            name,
            cpf,
            crm,
            type,
            zipcode,
            state,
            city,
            district,
            street,
            number,
            residential,
            comercial,
            other,
            firstSpecialty,
            secondSpecialty
        })*/
        const physician = {
            name,
            cpf,
            crm
        }

        const response = await api.post(`physicians`, physician)
        const id = response.data.msg.id


        const address = {
            physicianId: id,
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
                physicianId: id,
                type: 'residencial',
                contact: residential
            })
        }

        if (comercial !== '') {
            await api.post(`contacts`, {
                physicianId: id,
                type: 'comercial',
                contact: comercial
            })
        }
        if (other !== '') {
            await api.post(`contacts`, {
                physicianId: id,
                type: 'outros',
                contact: other
            })
        }

        if (firstSpecialty !== '') {
            await api.post(`physicianspecialties`, {
                physicianId: id,
                specialtiesId: firstSpecialty
            })
        }

        if (secondSpecialty !== '') {
            await api.post(`physicianspecialties`, {
                physicianId: id,
                specialtiesId: secondSpecialty
            })
        }

        props.close()
    }


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
                            id="name"
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
                            id="cpf"
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
                            id="crm"
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
                                id="demo-simple-select"
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
                            id="zipcode"
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
                            id="state"
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
                            id="city"
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
                            id="district"
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
                            id="street"
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
                            id="number"
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
                            id="residential"
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
                            id="comercial"
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
                            id="number"
                            name="number"
                            label="Outros"
                            fullWidth
                            autoComplete="number"
                            value={other}
                            onChange={e => setOther(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlStyled>
                            <InputLabel id="demo-simple-select-label">1º Especialidade</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
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
                                id="demo-simple-select"
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
                <Button onClick={handleInsert}>Salvar</Button>
            </DialogActions>
        </Dialog>
    )
}
