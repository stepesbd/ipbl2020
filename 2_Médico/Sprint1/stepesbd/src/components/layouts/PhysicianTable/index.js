import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { IconButton } from '@material-ui/core';
import Title from '../../utils/Title';
import { Edit, Delete } from '@material-ui/icons'

// Generate Order Data
function createData(id, name, crm, specialtie) {
    return { id, name, crm, specialtie };
}

const rows = [
    createData(0, 'Elvis Presley', '1454923-SP', 'Clínica Médica'),
    createData(1, 'Paul McCartney', '1454923-SP', 'Biomédico'),
    createData(2, 'Tom Scholz', '1454923-SP', 'Dermatologia'),
    createData(3, 'Michael Jackson', '1454923-SP', 'Cirurgia Geral'),
    createData(4, 'Bruce Springsteen', '1454923-SP', 'Endocrinologia'),
];

export default function PhysicianTable() {
    return (
        <React.Fragment>
            <Title>Médicos</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CRM</TableCell>
                        <TableCell>1ºEspecialidade</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.crm}</TableCell>
                            <TableCell>{row.specialtie}</TableCell>
                            <TableCell align="right">
                                <IconButton ><Edit style={{ color: '#2196f3' }} /></IconButton >
                                <IconButton ><Delete style={{ color: '#dc004e' }} /></IconButton >
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}