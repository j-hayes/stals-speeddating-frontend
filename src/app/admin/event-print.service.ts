import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
import { Account } from '../account/account';

@Injectable({
  providedIn: 'root'
})
export class EventPrintService {

  constructor() { }

  printEvent(eventDaters: Account[]) {
    const doc = new jsPDF();
    let maxRound = 0;
    eventDaters.forEach(x => {
      x.dates = x.dates.sort((x, y) => x.round - y.round);
      const userMaxRound = x.dates[x.dates.length - 1].round;
      if (userMaxRound > maxRound) {
        maxRound = userMaxRound;
      }
    });
    const nameX = 40;

    eventDaters.sort((a, b) => (a.sex > b.sex ? -1 : 1)).forEach(account => {
      const isFemale = account.sex == 'female';
      doc.setFontSize(15);
      doc.text(`Date Schedule For ${account.firstName} ${account.lastName}`, 10, 10);
      doc.setFontSize(12);
      doc.text(`Round    `, 10, 20);
      doc.text(`Date Name`, nameX, 20);
      let dateIndex = 0;
      for (let round = 1; round <= maxRound; round++) {
        const y = 20 + round * 9;
        
        doc.text(`${round}`, 10, y);
        const date = account.dates[dateIndex <= account.dates.length ? dateIndex : account.dates.length];
        if (date && date.round + 1 === round) {
          let datePerson: Account = null;
          if (isFemale) {
            datePerson = eventDaters.filter(x => x.Id === date.manId)[0];
          } else {
            datePerson = eventDaters.filter(x => x.Id === date.womanId)[0];
          }
          doc.text(`${datePerson.firstName} ${datePerson.lastName}`, nameX, y);
          dateIndex++;
        } else {
          doc.text(`BREAK`, nameX, y);
        }
        doc.line(0, y+2.5, 250, y+2.5);
      }

      doc.addPage("letter", "p");
    });
    doc.save("event_schedules.pdf");

  }
}
