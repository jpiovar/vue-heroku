<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col-md-9">
        <h2>Simple Quora</h2>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">New question</span>
          </div>
          <textarea v-model="newQuestionVal" @keydown.enter.prevent="addNewQuestion"
            class="form-control"
            aria-label="textarea" rows="1">
          </textarea>
          <div class="input-group-append">
            <button type="button" class="btn btn-primary btn-item" @click="addNewQuestion">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-9">
        <quora-cmp v-for="(item, index) in orderNewTop"
          :key="item.id"
          :index="index"
          :itemData="item"
        />
      </div>
      <div class="col-md-3">
        <user-info
          :logoutRef="logout"
          :userName="userProfile.name"
          :userEmail="userProfile.email"
        />
        <modal-dialog/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { USER, QUORA, MODE } from '../../../stores/constants';
import { MODE_EDIT, MODE_READ } from '@/stores/mode/constants';
import { UserData } from '../../../stores/user/user.types';
import { QuoraItem } from '../../../stores/quora/quora.types';
import QuoraCmp from './components/quoraCmp/QuoraCmp.vue';
import UserInfo from './components/userInfo/UserInfo.vue';
import ModalDialog from '../../common/modalDialog/ModalDialog.vue';
import { AppMode, Reference } from '@/stores/mode/mode.types';

const UserStore = namespace(USER);
const QuoraStore = namespace(QUORA);
const ModeStore = namespace(MODE);

@Component({
  components: {
    QuoraCmp,
    UserInfo,
    ModalDialog,
  },
  props: {},
})
export default class QuoraPage extends Vue {
  newQuestionVal: string = '';

  @UserStore.Action logoutUser!: () => void;

  @UserStore.Getter userData!: UserData;

  @QuoraStore.Getter quoraItems!: QuoraItem[];

  @ModeStore.Getter modeStatus!: AppMode;

  @ModeStore.Getter modeReference!: Reference;

  @QuoraStore.Action addNewQuestionStore!: ({ item }: { item: QuoraItem }) => void;

  @QuoraStore.Action destroyQuoraData!: () => void;

  @ModeStore.Action setMode!:
    ({ reference, status }: { reference: Reference, status: AppMode }) => void;

  logout() {
    console.log('logout clicked');
    this.logoutUser();
    const status = MODE_READ;
    const reference = { id: '', text: '' };
    this.setMode({ reference, status });
    this.destroyQuoraData();
  }

  addNewQuestion() {
    if (this.newQuestionVal.trim()) {
      const item = {
        id: `${Date.now()}`,
        text: this.newQuestionVal.trim(),
        author: this.userData,
        answers: [],
      };
      this.newQuestionVal = '';
      this.addNewQuestionStore({ item });
    }
  }

  get orderNewTop(): QuoraItem[] {
    return this.quoraItems.sort((a, b) => (a.id < b.id ? 1 : -1));
  }

  get userProfile() {
    const { name, email } = this.userData;
    return { name, email };
  }
}
</script>

<style lang="scss" scoped>
.btn-item {
  float: right;
  i {
      font-size: 18px;
  }
}
textarea:focus {
  border-color: none;
  box-shadow: none;
  -webkit-box-shadow: none;
  outline: -webkit-focus-ring-color auto 5px;
}
</style>
