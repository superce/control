import contorl_img from '@/assets/images/user.png'

//默认图
const defaultImg = function (value, type) {
    if (value) {
        return value
    } else {
        switch (type) {
            case 'contorl':
                return contorl_img
        }
    }

};
export default {defaultImg}