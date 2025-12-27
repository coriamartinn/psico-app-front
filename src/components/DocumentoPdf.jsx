import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Opcional: Registrar una fuente si quieres que se vea más estándar, 
// sino usará la Helvetica por defecto.
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
        lineHeight: 1.5,
        color: '#333'
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4
    },
    subtitle: {
        fontSize: 10,
        color: '#666'
    },
    datosPersonales: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9fafb',
        borderRadius: 4,
        border: 1,
        borderColor: '#e5e7eb'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4
    },
    label: {
        width: 100,
        fontWeight: 'bold', // Helvetica no soporta 'bold' numérico, usa fontFamily Helvetica-Bold si registras fuentes
        fontSize: 10,
        color: '#555'
    },
    value: {
        flex: 1,
        fontSize: 10
    },
    section: {
        marginBottom: 15
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: '#eee',
        padding: 4,
        marginBottom: 6,
        textTransform: 'uppercase'
    },
    text: {
        textAlign: 'justify',
        marginBottom: 5,
        fontSize: 11
    },
    imageContainer: {
        marginVertical: 10,
        alignItems: 'center'
    },
    chartImage: {
        width: '90%',
        height: 200, // Ajusta según necesites
        objectFit: 'contain'
    },
    firmaContainer: {
        marginTop: 50,
        alignItems: 'flex-end',
        paddingRight: 20
    },
    firmaLine: {
        width: 200,
        borderTop: 1,
        borderColor: '#000',
        marginBottom: 5
    },
    firmaText: {
        fontSize: 10,
        textAlign: 'center',
        width: 200
    }
});

export const DocumentoPDF = ({ paciente, contenido, profesional, imagenes }) => {
    // Fecha actual formateada
    const fechaHoy = new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* ENCABEZADO */}
                <View style={styles.header}>
                    <Text style={styles.title}>Informe Psicopedagógico</Text>
                    <Text style={styles.subtitle}>Confidencial</Text>
                </View>

                {/* DATOS DEL PACIENTE */}
                <View style={styles.datosPersonales}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Paciente:</Text>
                        <Text style={styles.value}>{paciente.first_name} {paciente.last_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Edad:</Text>
                        <Text style={styles.value}>{paciente.age} años</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Escolaridad:</Text>
                        <Text style={styles.value}>{paciente.school_grade || "No especificado"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Fecha:</Text>
                        <Text style={styles.value}>{fechaHoy}</Text>
                    </View>
                </View>

                {/* CONTENIDO DEL INFORME */}

                {/* Motivo */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Motivo de Consulta</Text>
                    <Text style={styles.text}>{contenido.motivo}</Text>
                </View>

                {/* Técnicas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Técnicas Administradas</Text>
                    <Text style={styles.text}>{contenido.tecnicas}</Text>
                </View>

                {/* Cognitivo + Gráfico WISC */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Funcionamiento Cognitivo</Text>
                    <Text style={styles.text}>{contenido.cognitivo}</Text>

                    {/* AQUÍ SE RENDERIZA LA IMAGEN SI EXISTE */}
                    {imagenes.wisc && (
                        <View style={styles.imageContainer}>
                            <Image src={imagenes.wisc} style={styles.chartImage} />
                            <Text style={{ fontSize: 8, color: '#666', marginTop: 2 }}>Perfil WISC-V</Text>
                        </View>
                    )}
                </View>

                {/* Lectoescritura + Gráfico PROLEXIA */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Habilidades Lectoescritas</Text>
                    <Text style={styles.text}>{contenido.lectoescritura}</Text>

                    {/* AQUÍ SE RENDERIZA LA IMAGEN SI EXISTE */}
                    {imagenes.prolexia && (
                        <View style={styles.imageContainer}>
                            <Image src={imagenes.prolexia} style={styles.chartImage} />
                            <Text style={{ fontSize: 8, color: '#666', marginTop: 2 }}>Perfil PROLEXIA</Text>
                        </View>
                    )}
                </View>

                {/* Conclusiones */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Conclusiones y Orientaciones</Text>
                    <Text style={styles.text}>{contenido.conclusiones}</Text>
                </View>

                {/* FIRMA PROFESIONAL */}
                <View style={styles.firmaContainer}>
                    <View style={styles.firmaLine} />
                    <Text style={styles.firmaText}>Lic. {profesional.nombre}</Text>
                    <Text style={styles.firmaText}>{profesional.matricula}</Text>
                </View>

            </Page>
        </Document>
    );
};