import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 50, fontFamily: 'Helvetica', fontSize: 11, lineHeight: 1.5 },
    mainTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, textTransform: 'uppercase', textDecoration: 'underline' },
    sectionTitle: { fontSize: 11, fontWeight: 'bold', marginTop: 15, marginBottom: 5, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#ccc' },
    text: { textAlign: 'justify', marginBottom: 5, fontSize: 11 },
    row: { flexDirection: 'row', marginBottom: 2 },
    label: { width: 130, fontWeight: 'bold', fontSize: 11 },
    value: { flex: 1, fontSize: 11 },
    firma: { marginTop: 50, alignItems: 'center' },
    imgContainer: { marginTop: 10, marginBottom: 10, alignItems: 'center' }
});

export const DocumentoPDF = ({ paciente, contenido, profesional, imagenes }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            <Text style={styles.mainTitle}>INFORME DE EVALUACIÓN PSICOPEDAGÓGICA</Text>

            <View>
                <Text style={styles.sectionTitle}>Datos Personales</Text>
                <View style={styles.row}><Text style={styles.label}>Paciente:</Text><Text style={styles.value}>{paciente.first_name} {paciente.last_name}</Text></View>
                <View style={styles.row}><Text style={styles.label}>Edad:</Text><Text style={styles.value}>{paciente.edad || "-"}</Text></View>
                <View style={styles.row}><Text style={styles.label}>Escolaridad:</Text><Text style={styles.value}>{paciente.school_grade}</Text></View>
                <View style={styles.row}><Text style={styles.label}>Fecha:</Text><Text style={styles.value}>{new Date().toLocaleDateString()}</Text></View>
            </View>

            <View><Text style={styles.sectionTitle}>Motivo de Consulta</Text><Text style={styles.text}>{contenido.motivo}</Text></View>
            <View><Text style={styles.sectionTitle}>Pruebas Administradas</Text><Text style={styles.text}>{contenido.tecnicas}</Text></View>

            {/* SECCIÓN COGNITIVO */}
            <View>
                <Text style={styles.sectionTitle}>FUNCIONAMIENTO COGNITIVO</Text>
                <Text style={styles.text}>{contenido.cognitivo}</Text>
                {/* GRÁFICO WISC AQUÍ */}
                {imagenes?.wisc && (
                    <View style={styles.imgContainer}>
                        <Image src={imagenes.wisc} style={{ width: 450 }} />
                    </View>
                )}
            </View>

            {/* SECCIÓN LECTOESCRITURA */}
            <View>
                <Text style={styles.sectionTitle}>CONOCIMIENTOS LECTOESCRITOS</Text>
                <Text style={styles.text}>{contenido.lectoescritura}</Text>
                {/* GRÁFICO PROLEXIA AQUÍ */}
                {imagenes?.prolexia && (
                    <View style={styles.imgContainer}>
                        <Image src={imagenes.prolexia} style={{ width: 450 }} />
                    </View>
                )}
            </View>

            <View><Text style={styles.sectionTitle}>Conclusiones</Text><Text style={styles.text}>{contenido.conclusiones}</Text></View>

            <View style={styles.firma}>
                <View style={{ borderTopWidth: 1, width: 200, marginBottom: 5 }} />
                <Text style={{ fontWeight: 'bold' }}>{profesional.nombre}</Text>
                <Text>Psicopedagoga - {profesional.matricula}</Text>
            </View>
        </Page>
    </Document>
);