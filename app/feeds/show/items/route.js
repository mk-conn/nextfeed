import Ember from "ember";
import Env from "ambitious-oc-news/config/environment";
import InfinityRoute from "ember-infinity/mixins/route";

const {
  get,
  set,
  computed,
  $
} = Ember;

export default Ember.Route.extend(InfinityRoute, {

  offset: "0",

  _canLoadMore: true,

  batchSize: Env.APP.articles.batchSize || "10",

  getRead: "true",

  oldestFirst: "false",

  feed: null,

  type: "0",

  // perPageParam: "",
  // pageParam: "offset",
  // totalPagesParam: "",

  init() {
    set(this, 'offset', undefined);
  },

  model() {
    Ember.debug('>>>> loading model for: feeds.show.items');
    Ember.debug('>>>> Feed-ID: ' + get(this.modelFor('feeds.show'), 'id'));

    set(this, 'feed', get(this.modelFor('feeds.show'), 'id'));

    return this.infinityModel('item', {},
      {
        batchSize: 'batchSize',
        offset: 'offset',
        type: 'type',
        id: 'feed',
        getRead: 'getRead',
        oldestFirst: 'oldestFirst'
      });

    // set(this, 'feed', get(this.modelFor('feeds.show'), 'id'));

  },
  /**
   *
   * @param model
   */
  afterModel(model) {
    Ember.debug('>>>> Feeds.Show.Items-Route::afterModel()');

    set(model, 'feed', this.modelFor('feeds.show'));

    Ember.debug('>>>> Feeds.Show.Items-Route::afterModel(): after set feed');
  },
  /**
   *
   * @param articles
   */
  afterInfinityModel(articles) {

    Ember.debug('>>>> Feeds.Show.Items-Route::afterInfinityModel()');

    const lastObjectId = articles.get('lastObject.id');
    const loadedAny = articles.get('length') > 0;

    set(this, '_canLoadMore', loadedAny);
    set(this, 'offset', lastObjectId);

    Ember.debug('>>>> Feeds.Show.Items-Route::afterInfinityModel(): after set');
    Ember.debug('----- Articles offset: ' + get(this, 'offset') + ' -----');
  },
  /**
   *
   */
  renderTemplate() {
    this.render('feeds/show/items', {
      into: 'application',
      outlet: 'main'
    });
  },

  actions: {
    /**
     *
     * @param feed
     */
    transitionToFeed(feed) {
      Ember.debug('>>>> transitionToFeed ' + feed.id);
      this.send('transition', 'feeds.show.items', feed);
    },
    /**
     *
     * @param article
     */
    openArticle(article) {
      this.send('transition', 'feeds.show.items.show', article);
    },

    closeArticle() {
      this.send('transition', 'feeds.show.items', this.modelFor('feeds.show'));
    },
    // loading() {
    //   this.render(
    //     'feeds/show/items/loading', {
    //       into: 'feeds/items'
    //     });
    // },

    willTransition() {

      set(this, 'offset', "0");

      this._super(...arguments);

    }
  }
});