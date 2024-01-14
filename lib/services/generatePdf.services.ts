import { jsPDF } from 'jspdf';

import autoTable, { Styles } from 'jspdf-autotable';

import { showToast } from '@/lib/showToast';
import Logo from "@/public/icon-512x512.png";

interface IAssistance {
    class: string,
    date: string
}

interface IStudents {
    email: string,
    firstName: string,
    lastName: string,
    pid: string,
    initClass: string
}

interface IInfo {
    dataAssistance: IAssistance 
    students: IStudents[]
}


export const generatePDFStudents = async (info: IInfo) =>{

    try {

        const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
        putOnlyUsedFonts: true
        });
    
    
        const columnStyles:{
        [key:string]: Partial<Styles>
        } = {}
    
        const head = [['NOMBRE', 'APELLIDO', 'CEDULA', 'CORREO ELECTRONICO','INICIO DE LLAMADA']]
    
        
        const body = info.students.map( (r) => {
        
        const arr = [
            r.firstName,
            r.lastName,
            r.pid,
            r.email,
            r.initClass,
        ]
        
        return arr
        })
        
    
        for( let c in  body[0] ){
    
        columnStyles[c] = {valign: 'middle', halign: 'center', minCellHeight: 12}                
    
        }
    
        const font = pdf.getFont()


        pdf.setFontSize(16).setFont(font.fontName, 'bold').setTextColor('#000000')
        pdf.text('Universidad Santa María',  pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center'} )
    
        // pdf.setFontSize(12).setFont(font.fontName, 'bold').setTextColor('#000000')
        // pdf.text(`Catedra:`,25, 22);
        pdf.setFontSize(12).setFont(font.fontName, 'bold').setTextColor('#163273')
        pdf.text(`${info.dataAssistance.class}`,  pdf.internal.pageSize.getWidth() / 2, 25, { align: 'center'} )
    
        pdf.setFontSize(14).setFont(font.fontName, 'bold').setTextColor('#000000')
        pdf.text(`Asistencia`, pdf.internal.pageSize.getWidth() / 2, 40,{ align:'center'});

        pdf.setFontSize(11).setFont(font.fontName, 'normal').setTextColor('#000000')
        pdf.text(`${info.dataAssistance.date}`,  pdf.internal.pageSize.getWidth() / 2, 45,{ align:'center'});
    
        autoTable(pdf, {
            margin:{ top:50, right:15, left: 15 },
            headStyles: { fillColor:"#163273", halign: "center", valign: "middle", fontSize: 10, minCellHeight: 12 },
            columnStyles,
            head,
            body,
            styles: {
            font: "helvetica"
            }
            
        });
        
            
        pdf.save(`Asistencia-${info.dataAssistance.class}-${info.dataAssistance.date}.pdf`)

        showToast({
            type: "success",
            message: "Asistencia creada exitosamente"
        }) 



    } catch (error) {
  
        showToast({
            type: "error",
            message: "No se puedo crear la asistencia"
        })
      console.error('Error al crear la asistencia:', error);

    }
      
  }

  