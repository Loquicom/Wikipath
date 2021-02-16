const template = require('./template');

class TitleService {

    get() {
        return document.title;
    }

    getMain() {
        const mainTitle = document.title.split('-')[0];
        if (!mainTitle) {
            return this.get();
        }
        return mainTitle.trim();
    }

    getSub() {
        const subTitle = document.title.split('-')[1];
        if (!subTitle) {
            return '';
        }
        return subTitle.trim();
    }

    getPage(page) {
        const subTitle = template.translate(`title.${page}`);
        if (subTitle.trim() === '') {
            return this.getMain();
        }
        return this.getMain() + ' - ' + subTitle;
    }

    set(title) {
        document.title = title;
    }

    setMain(mainTitle) {
        document.title = mainTitle + ' - ' + this.getSub();
    }

    setSub(subTitle) {
        if (subTitle.trim() === '') {
            document.title = this.getMain();
        } else {
            document.title = this.getMain() + ' - ' + subTitle;
        }
    }

    setPage(page) {
        this.setSub(template.translate(`title.${page}`));
    }

}

module.exports = new TitleService();