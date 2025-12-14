import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Pupil, Mark, ClassSubject, School } from '../db/db';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { Printer, Download } from 'lucide-react';

// PDF Styles
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
    header: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10 },
    logo: { width: 60, height: 60, marginRight: 15 },
    schoolInfo: { flex: 1, justifyContent: 'center' },
    schoolName: { fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
    subHeader: { fontSize: 10, color: '#444' },
    reportTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginVertical: 10, textTransform: 'uppercase', textDecoration: 'underline' },
    pupilInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 4 },
    infoCol: { flexDirection: 'column', gap: 4 },
    infoRow: { flexDirection: 'row' },
    label: { fontWeight: 'bold', width: 80 },
    table: { width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', marginBottom: 15 },
    tableRow: { margin: 'auto', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#bfbfbf' },
    tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
    tableCol: { width: '25%', borderRightWidth: 1, borderRightColor: '#bfbfbf', padding: 5 },
    tableColSmall: { width: '15%', borderRightWidth: 1, borderRightColor: '#bfbfbf', padding: 5 },
    tableColLarge: { width: '45%', borderRightWidth: 1, borderRightColor: '#bfbfbf', padding: 5 },
    tableCell: { fontSize: 10 },
    footer: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' },
    signatureBox: { width: '40%', borderTopWidth: 1, borderTopColor: '#000', paddingTop: 5, textAlign: 'center' },
    summaryBox: { marginTop: 15, padding: 10, borderWidth: 1, borderColor: '#000', flexDirection: 'row', justifyContent: 'space-around' },
    summaryItem: { flexDirection: 'column', alignItems: 'center' },
    summaryLabel: { fontSize: 8, color: '#666' },
    summaryValue: { fontSize: 12, fontWeight: 'bold' }
});

// PDF Document Component
const ReportCardPDF: React.FC<{
    school: School;
    pupil: Pupil;
    className: string;
    subjects: ClassSubject[];
    marks: Mark[];
    position: number;
    totalPupils: number;
}> = ({ school, pupil, className, subjects, marks, position, totalPupils }) => {

    const getMark = (subjectId: number) => marks.find(m => m.subjectId === subjectId)?.score;

    const totalScore = subjects.reduce((sum, sub) => {
        const score = getMark(sub.id!) || 0;
        return sum + (score * sub.coefficient);
    }, 0);

    const totalCoeff = subjects.reduce((sum, sub) => sum + sub.coefficient, 0);
    const average = totalCoeff > 0 ? (totalScore / totalCoeff).toFixed(2) : '0.00';

    const getGrade = (avg: number) => {
        if (avg >= 18) return 'A+';
        if (avg >= 16) return 'A';
        if (avg >= 14) return 'B+';
        if (avg >= 12) return 'B';
        if (avg >= 10) return 'C';
        return 'F';
    };

    const getRemark = (avg: number) => {
        if (avg >= 18) return 'Excellent';
        if (avg >= 16) return 'Very Good';
        if (avg >= 14) return 'Good';
        if (avg >= 12) return 'Fair';
        if (avg >= 10) return 'Pass';
        return 'Needs Improvement';
    };

    const avgNum = parseFloat(average as string);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    {school.logo && <Image src={school.logo} style={styles.logo} />}
                    <View style={styles.schoolInfo}>
                        <Text style={styles.schoolName}>{school.name}</Text>
                        <Text style={styles.subHeader}>Academic Year: {school.academicYear}</Text>
                        <Text style={styles.subHeader}>{school.term}</Text>
                    </View>
                </View>

                <Text style={styles.reportTitle}>Pupil Progress Report</Text>

                {/* Pupil Info */}
                <View style={styles.pupilInfo}>
                    <View style={styles.infoCol}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Name:</Text>
                            <Text>{pupil.name}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Class:</Text>
                            <Text>{className}</Text>
                        </View>
                    </View>
                    <View style={styles.infoCol}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Admission No:</Text>
                            <Text>{pupil.admissionNumber}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Sex:</Text>
                            <Text>{pupil.sex}</Text>
                        </View>
                    </View>
                </View>

                {/* Marks Table */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={styles.tableColLarge}><Text style={styles.tableCell}>Subject</Text></View>
                        <View style={styles.tableColSmall}><Text style={styles.tableCell}>Coeff</Text></View>
                        <View style={styles.tableColSmall}><Text style={styles.tableCell}>Mark (/20)</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Total</Text></View>
                    </View>
                    {subjects.map((subject) => {
                        const mark = getMark(subject.id!);
                        const total = mark !== undefined ? (mark * subject.coefficient).toFixed(1) : '-';
                        return (
                            <View key={subject.id} style={styles.tableRow}>
                                <View style={styles.tableColLarge}><Text style={styles.tableCell}>{subject.name}</Text></View>
                                <View style={styles.tableColSmall}><Text style={styles.tableCell}>{subject.coefficient}</Text></View>
                                <View style={styles.tableColSmall}><Text style={styles.tableCell}>{mark !== undefined ? mark : '-'}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{total}</Text></View>
                            </View>
                        );
                    })}
                </View>

                {/* Summary */}
                <View style={styles.summaryBox}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Score</Text>
                        <Text style={styles.summaryValue}>{totalScore.toFixed(1)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Average</Text>
                        <Text style={styles.summaryValue}>{average} / 20</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Position</Text>
                        <Text style={styles.summaryValue}>{position} / {totalPupils}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Grade</Text>
                        <Text style={styles.summaryValue}>{getGrade(avgNum)}</Text>
                    </View>
                </View>

                <View style={{ marginTop: 15, padding: 10, borderWidth: 1, borderColor: '#eee' }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Class Teacher's Remark:</Text>
                    <Text>{getRemark(avgNum)}</Text>
                </View>

                {/* Signatures */}
                <View style={styles.footer}>
                    <View style={styles.signatureBox}>
                        <Text>Class Teacher's Signature</Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text>Head Teacher's Signature</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const Reports: React.FC = () => {
    const [selectedClassId, setSelectedClassId] = useState<number>(0);
    const [selectedPupilId, setSelectedPupilId] = useState<number>(0);

    const school = useLiveQuery(() => db.school.toCollection().first());
    const classes = useLiveQuery(() => db.classes.orderBy('level').toArray());
    const pupils = useLiveQuery(
        () => selectedClassId ? db.pupils.where('classId').equals(selectedClassId).toArray() : [],
        [selectedClassId]
    );

    const subjects = useLiveQuery(
        () => selectedClassId ? db.classSubjects.where('classId').equals(selectedClassId).toArray() : [],
        [selectedClassId]
    );

    const marks = useLiveQuery(
        () => selectedClassId ? db.marks.toArray() : [], // Load all marks for class to calc positions
        [selectedClassId]
    );

    const selectedPupil = pupils?.find(p => p.id === selectedPupilId);
    const selectedClass = classes?.find(c => c.id === selectedClassId);
    const pupilMarks = marks?.filter(m => m.pupilId === selectedPupilId) || [];

    // Calculate Position
    const calculatePosition = (pId: number): number => {
        if (!marks || !subjects || !pupils) return 0;

        const pupilAverages = pupils.map(p => {
            const pMarks = marks.filter(m => m.pupilId === p.id);
            const totalScore = subjects.reduce((sum, sub) => {
                const mark = pMarks.find(m => m.subjectId === sub.id)?.score || 0;
                return sum + (mark * sub.coefficient);
            }, 0);
            return { id: p.id, score: totalScore };
        });

        pupilAverages.sort((a, b) => b.score - a.score);
        return pupilAverages.findIndex(p => p.id === pId) + 1;
    };

    const position = selectedPupilId ? calculatePosition(selectedPupilId) : 0;

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex-none">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Cards</h2>
                <p className="text-gray-500 mb-6">Generate and print report cards.</p>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <select
                            value={selectedClassId}
                            onChange={(e) => {
                                setSelectedClassId(parseInt(e.target.value));
                                setSelectedPupilId(0);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="0">-- Select Class --</option>
                            {classes?.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <select
                            value={selectedPupilId}
                            onChange={(e) => setSelectedPupilId(parseInt(e.target.value))}
                            disabled={!selectedClassId}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                        >
                            <option value="0">-- Select Pupil --</option>
                            {pupils?.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {school && selectedPupil && selectedClass && subjects && (
                <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative">
                    <PDFViewer width="100%" height="100%" className="w-full h-full">
                        <ReportCardPDF
                            school={school}
                            pupil={selectedPupil}
                            className={selectedClass.name}
                            subjects={subjects}
                            marks={pupilMarks}
                            position={position}
                            totalPupils={pupils?.length || 0}
                        />
                    </PDFViewer>
                </div>
            )}

            {(!selectedClassId || !selectedPupilId) && (
                <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-center text-gray-500">
                        <Printer className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Select a class and pupil to generate a report card.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
