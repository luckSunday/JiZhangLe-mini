import { useDetailStoreWithOut } from '../../store';
import { saveRecord as saveRecordfn } from '../../api/user';
const detailStore = useDetailStoreWithOut();
/**
 * @description 保存用户学习进度接口
 * @param {number} lesson_id 课表id
 * @param {number} view_time 记录的时长
 */
export function saveRecord(lesson_id: number, view_time: string | number) {
  if (view_time) {
    let obj = detailStore.getLessonLastTime;
    if (!obj) {
      obj = {};
    }
    obj[String(lesson_id)] = String(view_time);
    detailStore.setLessonLastTime(obj);
  }
  saveRecordfn({ lesson_id: lesson_id.toString(), view_time: parseInt(view_time as string) });
}
