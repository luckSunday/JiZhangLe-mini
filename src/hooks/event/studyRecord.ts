import { saveStudyPeriod } from '/@/api/detail';
class Study {
  options: any;
  start_time: any;
  end_time: any;
  constructor() {
    this.options = {};
    this.start_time = null;
    this.end_time = null;
  }

  // 获取当前时间精确到毫秒
  getStartTime() {
    this.start_time = this.getTime();
    return this.start_time;
  }

  getEndTime() {
    this.end_time = this.getTime();
    return this.end_time;
  }

  getTime() {
    const yy = new Date().getFullYear();
    let mm = new Date().getMonth() + 1;
    mm = mm < 10 ? `0${mm}` : mm;
    let dd = new Date().getDate();
    dd = dd < 10 ? `0${dd}` : dd;
    let hh = new Date().getHours();
    hh = hh < 10 ? `0${hh}` : hh;

    const mf =
      new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes();
    const ss =
      new Date().getSeconds() < 10 ? `0${new Date().getSeconds()}` : new Date().getSeconds();
    const ms = new Date().getMilliseconds();
    // + ":" + ms;
    const dateTime = `${yy}-${mm}-${dd} ${hh}:${mf}:${ss}`;
    return dateTime;
  }

  saveStudyPeriod(curriculum_id) {
    const params = {
      start_time: this.start_time,
      end_time: this.end_time,
      curriculum_id,
    };
    saveStudyPeriod(params);
  }

  submitStudy(curriculum_id) {
    this.getEndTime();
    this.saveStudyPeriod(curriculum_id);
  }
}

export default Study;
