import Ember from 'ember';

const {get, $, set, computed, observer, run, typeOf} = Ember;

export default Ember.Component.extend({
  classNames: ['card item'],
  classNameBindings: ['isUnread'],
  showFull: false,
  articleOpen: observer('showFull', function () {
    const item = get(this, 'item');
    if (get(item, 'unread')) {
      item.markRead();
    }
    run.scheduleOnce('render', this, function () {

      const component = this.$();

      $('iframe, img, video', component).each(function () {
        const origWidth = typeOf($(this).attr('width')) !== 'undefined' ? $(this).attr('width') : $(this).width();
        const origHeight = typeOf($(this).attr('height')) !== 'undefined' ? $(this).attr('height') : $(this).height();
        const currentWidth = $('.item-body', component).width();

        if (origWidth > currentWidth) {

          const factor = origWidth / currentWidth;
          const scaledWidth = currentWidth;
          const scaledHeight = Math.round(origHeight / factor);

          $(this).attr('width', scaledWidth);
          $(this).attr('height', scaledHeight);

        }
      });
    });

  }),

  isUnread: computed('item.unread', {
    get() {
      return get(this, 'item.unread');
    },
    set(type, unread) {
      const item = get(this, 'item');
      if (unread === true) {
        item.markUnread();
      } else {
        item.markRead();
      }
    }
  }),
  isStarred: computed('item.starred', {
    get() {
      return get(this, 'item.starred');
    },
    set(type, star) {
      const item = get(this, 'item');

      if (star === true) {
        item.star();
      } else {
        item.unstar();
      }
    }
  }),
  starHint: computed('isStarred', function () {
    if (get(this, 'isStarred')) {
      return 'Unpin article';
    }
    return 'Pin article';
  }),
  openCloseHint: computed('showFull', function () {
    if (get(this, 'showFull')) {
      return 'Close article';
    }
    return 'Open article';
  }),
  readUnreadHint: computed('isUnread', function () {
    if (get(this, 'isUnread')) {
      return 'Mark read';
    }
    return 'Mark unread';
  }),
  excerpt: computed('item.body', function () {
    const stripAt = 160;
    let text = $(get(this, 'item.body')).text();
    if (text.length > stripAt) {
      text = text.slice(0, stripAt) + ' ...'.htmlSafe();
    }
    return text;
  }),
  body: computed('item.body', function () {
    return get(this, 'item.body').htmlSafe();
  }),
  actions: {
    toggleShowFull() {
      this.toggleProperty('showFull');
    },
    toggleUnread() {
      this.toggleProperty('isUnread');
    },
    toggleStarred() {
      this.toggleProperty('isStarred');
    },
    originalArticle() {
      if (get(this, 'item.unread')) {
        get(this, 'item').markRead();
      }
    }
  }
});
