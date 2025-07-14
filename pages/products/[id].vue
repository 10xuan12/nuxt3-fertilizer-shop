<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>商品詳細資料</h1>
      <div class="d-flex gap-2">
        <button class="btn btn-success" @click="startEdit" v-if="!isEditing">
          <i class="bi bi-pencil me-2"></i>編輯
        </button>
        <NuxtLink to="/products" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>返回列表
        </NuxtLink>
      </div>
    </div>
    <div class="card p-4">
      <!-- 顯示模式 -->
      <div v-if="!isEditing">
        <div class="row mb-3">
          <div class="col-md-6 mb-2">
            <strong>肥料類型：</strong>{{ product.type }}
          </div>
          <div class="col-md-6 mb-2">
            <strong>廠牌商品名稱：</strong>{{ product.brandName }}
          </div>
          <div class="col-md-6 mb-2">
            <strong>業者名稱：</strong>{{ product.companyName }}
          </div>
          <div class="col-md-6 mb-2">
            <strong>登記字號：</strong>{{ product.registrationNo }}
          </div>
          <div class="col-md-6 mb-2">
            <strong>商品編號：</strong>{{ product.productCode }}
          </div>
          <div class="col-md-6 mb-2">
            <strong>品目名稱：</strong>{{ product.itemName }}
          </div>
          <div class="col-md-6 mb-2">
            <strong>性狀：</strong>{{ product.property }}
          </div>
          <div class="col-md-6 mb-2">
            <strong>適用作物：</strong>{{ product.crops.join('、') }}
          </div>
          <div class="col-md-6 mb-2">
            <strong>登記證有效日期：</strong>{{ product.validDate }}
          </div>
          <div class="col-md-6 mb-2">
            <strong>產品規格：</strong>{{ product.spec }}
          </div>
        </div>
        <div class="mb-3">
          <strong>產品介紹：</strong>
          <div v-for="(section, idx) in product.introSections" :key="idx" class="mb-2">
            <div v-if="section.type==='text'">
              <div class="bg-light p-2 rounded">{{ section.content }}</div>
            </div>
            <div v-else>
              <img :src="section.imageUrl" alt="產品介紹圖片" style="max-width:220px; border-radius:8px;" />
            </div>
          </div>
        </div>
        <div class="mb-3">
          <strong>產品圖片：</strong>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <img v-for="(img, idx) in product.images" :key="idx" :src="img.url" alt="產品圖片" style="max-width: 120px; border-radius: 8px;" />
          </div>
        </div>
        <div class="mb-3">
          <strong>生產紀錄：</strong>
          <ul>
            <li v-for="(url, idx) in product.productionRecords" :key="idx">
              <a :href="url" target="_blank">{{ url }}</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 編輯模式 -->
      <form v-else @submit.prevent="saveChanges" v-if="editedProduct">
        <div class="row mb-3">
          <div class="col-md-6 mb-3">
            <label class="form-label">肥料類型</label>
            <select v-model="editedProduct.type" class="form-select" required>
                <option value="">請選擇</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">廠牌商品名稱</label>
            <input v-model="editedProduct.brandName" type="text" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">業者名稱</label>
            <input v-model="editedProduct.companyName" type="text" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">登記字號</label>
            <input v-model="editedProduct.registrationNo" type="text" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">商品編號</label>
            <input v-model="editedProduct.productCode" type="text" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">品目名稱</label>
            <select v-model="editedProduct.itemName" class="form-select">
                <option value="">請選擇</option>
                <option v-for="item in itemNameOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">性狀</label>
            <select v-model="editedProduct.property" class="form-select">
              <option value="固態">固態</option>
              <option value="液態">液態</option>
              <option value="液態(含懸濁狀、乳狀或糊狀)">液態(含懸濁狀、乳狀或糊狀)</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">適用作物</label>
            <div class="d-flex flex-wrap gap-2">
              <div class="form-check" v-for="crop in cropOptions" :key="crop">
                <input class="form-check-input" type="checkbox" :id="'crop-' + crop" :value="crop" v-model="editedProduct.crops" />
                <label class="form-check-label" :for="'crop-' + crop">{{ crop }}</label>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">登記證有效日期</label>
            <input v-model="editedProduct.validDate" type="date" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">產品規格</label>
            <input v-model="editedProduct.spec" type="text" class="form-control" />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">產品介紹</label>
          <div v-for="(section, idx) in editedProduct.introSections" :key="idx" class="mb-2 border rounded p-2 bg-light">
            <div class="d-flex align-items-center mb-2">
              <select v-model="section.type" class="form-select w-auto me-2" style="min-width:90px">
                <option value="text">文字</option>
                <option value="image">圖片</option>
              </select>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="removeSection(idx)">刪除</button>
            </div>
            <div v-if="section.type==='text'">
              <textarea v-model="section.content" class="form-control" rows="2" placeholder="輸入文字內容"></textarea>
            </div>
            <div v-else>
              <input type="text" v-model="section.imageUrl" class="form-control" placeholder="圖片網址" />
            </div>
          </div>
          <button type="button" class="btn btn-outline-primary btn-sm" @click="addSection">＋ 新增段落</button>
        </div>
        <div class="mb-3">
          <label class="form-label">產品圖片網址</label>
          <div v-for="(img, idx) in editedProduct.images" :key="idx" class="input-group mb-2">
            <input v-model="img.url" type="text" class="form-control" placeholder="圖片網址" />
            <button type="button" class="btn btn-outline-danger" @click="removeImage(idx)">刪除</button>
          </div>
          <button type="button" class="btn btn-outline-primary btn-sm" @click="addImage">＋ 新增圖片</button>
        </div>
        <div class="mb-3">
          <label class="form-label">生產紀錄</label>
          <div v-for="(url, idx) in editedProduct.productionRecords" :key="idx" class="input-group mb-2">
            <input v-model="editedProduct.productionRecords[idx]" type="url" class="form-control" placeholder="網址" />
            <button type="button" class="btn btn-outline-danger" @click="removeProductionRecord(idx)">刪除</button>
          </div>
          <button type="button" class="btn btn-outline-primary btn-sm" @click="addProductionRecord">＋ 新增網址</button>
        </div>
        <div class="d-flex gap-2 justify-content-end">
          <button type="submit" class="btn btn-success">儲存</button>
          <button type="button" class="btn btn-secondary" @click="cancelEdit">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useCategories } from '@/composables/useCategories'

const { categories } = useCategories()

const route = useRoute()
const id = route.params.id

// 定義商品資料型別
interface Product {
  type: string
  brandName: string
  companyName: string
  registrationNo: string
  productCode: string
  itemName: string
  property: string
  crops: string[]
  introSections: Array<{
    type: 'text' | 'image'
    content: string
    imageUrl: string
  }>
  validDate: string
  spec: string
  images: Array<{ url: string }>
  productionRecords: string[]
}

// 編輯狀態
const isEditing = ref(false)
const editedProduct = ref<Product | undefined>(undefined)

// 選項資料
const itemNameOptions = [
  '1-01 黃腐酸肥料', '1-02 硝酸鈣肥料', '1-03 鎂質複合肥料', '1-04 丁烯二酸鉀合成肥料',
  '1-05 丁烯二酸鈉尿素肥料', '1-06 硝酸鎂鈣複肥料', '1-07 硝酸鉀肥料', '1-08 硝酸鎂鉀複肥料',
  '1-09 二氧化矽肥料', '1-10 矽化鉀肥料', '1-11 矽酸鉀肥料', '1-12 矽酸鈣肥料',
  '1-13 矽酸鎂肥料', '1-14 矽酸鋁肥料', '1-15 矽氧化鈣與鎂肥料', '1-16 鎂氧化鈣肥料',
  '1-17 鎂氧化鎂肥料', '1-18 鎂氧化鋁肥料', '1-19 鎂氧化鋅肥料', '1-20 鎂氧化鐵肥料',
  '2-01 鉀肥料', '2-02 鉀鎂肥料', '2-03 鉀鈣肥料', '2-04 鉀鋅肥料',
  '2-05 鉀銅肥料', '2-06 鉀錳肥料', '2-07 鉀硼肥料', '2-08 鉀矽肥料',
  '2-09 鉀酸鎂肥料', '3-01 鎂肥料', '3-02 鎂鈣肥料', '3-03 鎂鋅肥料',
  '3-04 鎂銅肥料', '3-05 鎂錳肥料', '3-06 鎂硼肥料', '3-07 鎂矽肥料',
  '3-08 鎂工業廢料肥料', '3-09 鎂高爐渣肥料', '4-01 鈣肥料', '4-02 鈣鎂肥料',
  '4-03 鈣鋅肥料', '4-04 鈣銅肥料', '4-05 鈣錳肥料', '4-06 鈣硼肥料',
  '4-07 鈣矽肥料', '4-08 鈣合金肥料', '4-09 鈣合金複肥料', '4-10 鈣合金鎂肥料',
  '4-11 鈣合金鋅肥料', '4-12 鈣合金銅肥料', '4-13 鈣合金錳肥料', '4-14 鈣合金硼肥料',
  '4-15 鈣合金矽肥料', '4-16 鈣合金工業廢料肥料', '4-17 鈣合金高爐渣肥料', '4-18 鈣合金石灰肥料',
  '4-19 鈣合金石灰石肥料', '4-20 鈣合金石膏肥料', '4-21 鈣合金碳酸鈣肥料', '4-22 鈣合金碳酸鎂肥料',
  '4-23 鈣合金碳酸鋅肥料', '4-24 鈣合金碳酸銅肥料', '4-25 鈣合金碳酸錳肥料', '4-26 鈣合金碳酸硼肥料',
  '4-27 鈣合金碳酸矽肥料', '4-28 鈣合金碳酸工業廢料肥料', '4-29 鈣合金碳酸高爐渣肥料', '4-30 鈣合金碳酸石灰肥料',
  '4-31 鈣合金碳酸石灰石肥料', '4-32 鈣合金碳酸石膏肥料', '4-33 鈣合金碳酸鈣肥料', '4-34 鈣合金碳酸鎂肥料',
  '4-35 鈣合金碳酸鋅肥料', '4-36 鈣合金碳酸銅肥料', '4-37 鈣合金碳酸錳肥料', '4-38 鈣合金碳酸硼肥料',
  '5-01 鋅肥料', '5-02 鋅鎂肥料', '5-03 鋅鈣肥料', '5-04 鋅銅肥料',
  '5-05 鋅錳肥料', '5-06 鋅硼肥料', '5-07 鋅矽肥料', '5-08 鋅工業廢料肥料',
  '5-09 鋅高爐渣肥料', '5-10 鋅石灰肥料', '5-11 鋅石灰石肥料', '5-12 鋅石膏肥料',
  '5-13 鋅碳酸鈣肥料', '5-14 鋅碳酸鎂肥料', '5-15 鋅碳酸鋅肥料', '5-16 鋅碳酸銅肥料',
  '5-17 鋅碳酸錳肥料', '5-18 鋅碳酸硼肥料', '5-19 鋅碳酸矽肥料', '5-20 鋅碳酸工業廢料肥料',
  '5-21 鋅碳酸高爐渣肥料', '5-22 鋅碳酸石灰肥料', '5-23 鋅碳酸石灰石肥料', '5-24 鋅碳酸石膏肥料',
  '5-25 鋅碳酸鈣肥料', '5-26 鋅碳酸鎂肥料', '5-27 鋅碳酸鋅肥料', '5-28 鋅碳酸銅肥料',
  '5-29 鋅碳酸錳肥料', '5-30 鋅碳酸硼肥料', '5-31 鋅碳酸矽肥料', '5-32 鋅碳酸工業廢料肥料',
  '5-33 鋅碳酸高爐渣肥料', '5-34 鋅碳酸石灰肥料', '5-35 鋅碳酸石灰石肥料', '5-36 鋅碳酸石膏肥料',
  '5-37 鋅碳酸鈣肥料', '5-38 鋅碳酸鎂肥料', '5-39 鋅碳酸鋅肥料', '5-40 鋅碳酸銅肥料',
  '5-41 鋅碳酸錳肥料', '5-42 鋅碳酸硼肥料', '5-43 鋅碳酸矽肥料', '5-44 鋅碳酸工業廢料肥料',
  '5-45 鋅碳酸高爐渣肥料', '5-46 鋅碳酸石灰肥料', '5-47 鋅碳酸石灰石肥料', '5-48 鋅碳酸石膏肥料',
  '5-49 鋅碳酸鈣肥料', '5-50 鋅碳酸鎂肥料', '5-51 鋅碳酸鋅肥料', '5-52 鋅碳酸銅肥料',
  '5-53 鋅碳酸錳肥料', '5-54 鋅碳酸硼肥料', '5-55 鋅碳酸矽肥料', '5-56 鋅碳酸工業廢料肥料',
  '5-57 鋅碳酸高爐渣肥料', '5-58 鋅碳酸石灰肥料', '5-59 鋅碳酸石灰石肥料', '5-60 鋅碳酸石膏肥料',
  '5-61 鋅碳酸鈣肥料', '5-62 鋅碳酸鎂肥料', '5-63 鋅碳酸鋅肥料', '5-64 鋅碳酸銅肥料',
  '5-65 鋅碳酸錳肥料', '5-66 鋅碳酸硼肥料', '5-67 鋅碳酸矽肥料', '5-68 鋅碳酸工業廢料肥料',
  '5-69 鋅碳酸高爐渣肥料', '5-70 鋅碳酸石灰肥料', '5-71 鋅碳酸石灰石肥料', '5-72 鋅碳酸石膏肥料',
  '5-73 鋅碳酸鈣肥料', '5-74 鋅碳酸鎂肥料', '5-75 鋅碳酸鋅肥料', '5-76 鋅碳酸銅肥料',
  '5-77 鋅碳酸錳肥料', '5-78 鋅碳酸硼肥料', '5-79 鋅碳酸矽肥料', '5-80 鋅碳酸工業廢料肥料',
  '5-81 鋅碳酸高爐渣肥料', '5-82 鋅碳酸石灰肥料', '5-83 鋅碳酸石灰石肥料', '5-84 鋅碳酸石膏肥料',
  '5-85 鋅碳酸鈣肥料', '5-86 鋅碳酸鎂肥料', '5-87 鋅碳酸鋅肥料', '5-88 鋅碳酸銅肥料',
  '5-89 鋅碳酸錳肥料', '5-90 鋅碳酸硼肥料', '5-91 鋅碳酸矽肥料', '5-92 鋅碳酸工業廢料肥料',
  '5-93 鋅碳酸高爐渣肥料', '5-94 鋅碳酸石灰肥料', '5-95 鋅碳酸石灰石肥料', '5-96 鋅碳酸石膏肥料',
  '5-97 鋅碳酸鈣肥料', '5-98 鋅碳酸鎂肥料', '5-99 鋅碳酸鋅肥料', '5-100 鋅碳酸銅肥料',
  '5-101 鋅碳酸錳肥料', '5-102 鋅碳酸硼肥料', '5-103 鋅碳酸矽肥料', '5-104 鋅碳酸工業廢料肥料',
  '5-105 鋅碳酸高爐渣肥料', '5-106 鋅碳酸石灰肥料', '5-107 鋅碳酸石灰石肥料', '5-108 鋅碳酸石膏肥料',
  '5-109 鋅碳酸鈣肥料', '5-110 鋅碳酸鎂肥料', '5-111 鋅碳酸鋅肥料', '5-112 鋅碳酸銅肥料',
  '5-113 鋅碳酸錳肥料', '5-114 鋅碳酸硼肥料', '5-115 鋅碳酸矽肥料', '5-116 鋅碳酸工業廢料肥料',
  '5-117 鋅碳酸高爐渣肥料', '5-118 鋅碳酸石灰肥料', '5-119 鋅碳酸石灰石肥料', '5-120 鋅碳酸石膏肥料',
  '5-121 鋅碳酸鈣肥料', '5-122 鋅碳酸鎂肥料', '5-123 鋅碳酸鋅肥料', '5-124 鋅碳酸銅肥料',
  '5-125 鋅碳酸錳肥料', '5-126 鋅碳酸硼肥料', '5-127 鋅碳酸矽肥料', '5-128 鋅碳酸工業廢料肥料',
  '5-129 鋅碳酸高爐渣肥料', '5-130 鋅碳酸石灰肥料', '5-131 鋅碳酸石灰石肥料', '5-132 鋅碳酸石膏肥料',
  '5-133 鋅碳酸鈣肥料', '5-134 鋅碳酸鎂肥料', '5-135 鋅碳酸鋅肥料', '5-136 鋅碳酸銅肥料',
  '5-137 鋅碳酸錳肥料', '5-138 鋅碳酸硼肥料', '5-139 鋅碳酸矽肥料', '5-140 鋅碳酸工業廢料肥料',
  '5-141 鋅碳酸高爐渣肥料', '5-142 鋅碳酸石灰肥料', '5-143 鋅碳酸石灰石肥料', '5-144 鋅碳酸石膏肥料',
  '5-145 鋅碳酸鈣肥料', '5-146 鋅碳酸鎂肥料', '5-147 鋅碳酸鋅肥料', '5-148 鋅碳酸銅肥料',
  '5-149 鋅碳酸錳肥料', '5-150 鋅碳酸硼肥料', '5-151 鋅碳酸矽肥料', '5-152 鋅碳酸工業廢料肥料',
  '5-153 鋅碳酸高爐渣肥料', '5-154 鋅碳酸石灰肥料', '5-155 鋅碳酸石灰石肥料', '5-156 鋅碳酸石膏肥料',
  '5-157 鋅碳酸鈣肥料', '5-158 鋅碳酸鎂肥料', '5-159 鋅碳酸鋅肥料', '5-160 鋅碳酸銅肥料',
  '5-161 鋅碳酸錳肥料', '5-162 鋅碳酸硼肥料', '5-163 鋅碳酸矽肥料', '5-164 鋅碳酸工業廢料肥料',
  '5-165 鋅碳酸高爐渣肥料', '5-166 鋅碳酸石灰肥料', '5-167 鋅碳酸石灰石肥料', '5-168 鋅碳酸石膏肥料',
  '5-169 鋅碳酸鈣肥料', '5-170 鋅碳酸鎂肥料', '5-171 鋅碳酸鋅肥料', '5-172 鋅碳酸銅肥料',
  '5-173 鋅碳酸錳肥料', '5-174 鋅碳酸硼肥料', '5-175 鋅碳酸矽肥料', '5-176 鋅碳酸工業廢料肥料',
  '5-177 鋅碳酸高爐渣肥料', '5-178 鋅碳酸石灰肥料', '5-179 鋅碳酸石灰石肥料', '5-180 鋅碳酸石膏肥料',
  '5-181 鋅碳酸鈣肥料', '5-182 鋅碳酸鎂肥料', '5-183 鋅碳酸鋅肥料', '5-184 鋅碳酸銅肥料',
  '5-185 鋅碳酸錳肥料', '5-186 鋅碳酸硼肥料', '5-187 鋅碳酸矽肥料', '5-188 鋅碳酸工業廢料肥料',
  '5-189 鋅碳酸高爐渣肥料', '5-190 鋅碳酸石灰肥料', '5-191 鋅碳酸石灰石肥料', '5-192 鋅碳酸石膏肥料',
  '5-193 鋅碳酸鈣肥料', '5-194 鋅碳酸鎂肥料', '5-195 鋅碳酸鋅肥料', '5-196 鋅碳酸銅肥料',
  '5-197 鋅碳酸錳肥料', '5-198 鋅碳酸硼肥料', '5-199 鋅碳酸矽肥料', '5-200 鋅碳酸工業廢料肥料',
  '5-201 鋅碳酸高爐渣肥料', '5-202 鋅碳酸石灰肥料', '5-203 鋅碳酸石灰石肥料', '5-204 鋅碳酸石膏肥料',
  '5-205 鋅碳酸鈣肥料', '5-206 鋅碳酸鎂肥料', '5-207 鋅碳酸鋅肥料', '5-208 鋅碳酸銅肥料',
  '5-209 鋅碳酸錳肥料', '5-210 鋅碳酸硼肥料', '5-211 鋅碳酸矽肥料', '5-212 鋅碳酸工業廢料肥料',
  '5-213 鋅碳酸高爐渣肥料', '5-214 鋅碳酸石灰肥料', '5-215 鋅碳酸石灰石肥料', '5-216 鋅碳酸石膏肥料',
  '5-217 鋅碳酸鈣肥料', '5-218 鋅碳酸鎂肥料', '5-219 鋅碳酸鋅肥料', '5-220 鋅碳酸銅肥料',
  '5-221 鋅碳酸錳肥料', '5-222 鋅碳酸硼肥料', '5-223 鋅碳酸矽肥料', '5-224 鋅碳酸工業廢料肥料',
  '5-225 鋅碳酸高爐渣肥料', '5-226 鋅碳酸石灰肥料', '5-227 鋅碳酸石灰石肥料', '5-228 鋅碳酸石膏肥料',
  '5-229 鋅碳酸鈣肥料', '5-230 鋅碳酸鎂肥料', '5-231 鋅碳酸鋅肥料', '5-232 鋅碳酸銅肥料',
  '5-233 鋅碳酸錳肥料', '5-234 鋅碳酸硼肥料', '5-235 鋅碳酸矽肥料', '5-236 鋅碳酸工業廢料肥料',
  '5-237 鋅碳酸高爐渣肥料', '5-238 鋅碳酸石灰肥料', '5-239 鋅碳酸石灰石肥料', '5-240 鋅碳酸石膏肥料',
  '5-241 鋅碳酸鈣肥料', '5-242 鋅碳酸鎂肥料', '5-243 鋅碳酸鋅肥料', '5-244 鋅碳酸銅肥料',
  '5-245 鋅碳酸錳肥料', '5-246 鋅碳酸硼肥料', '5-247 鋅碳酸矽肥料', '5-248 鋅碳酸工業廢料肥料',
  '5-249 鋅碳酸高爐渣肥料', '5-250 鋅碳酸石灰肥料', '5-251 鋅碳酸石灰石肥料', '5-252 鋅碳酸石膏肥料',
  '5-253 鋅碳酸鈣肥料', '5-254 鋅碳酸鎂肥料', '5-255 鋅碳酸鋅肥料', '5-256 鋅碳酸銅肥料',
  '5-257 鋅碳酸錳肥料', '5-258 鋅碳酸硼肥料', '5-259 鋅碳酸矽肥料', '5-260 鋅碳酸工業廢料肥料',
  '5-261 鋅碳酸高爐渣肥料', '5-262 鋅碳酸石灰肥料', '5-263 鋅碳酸石灰石肥料', '5-264 鋅碳酸石膏肥料',
  '5-265 鋅碳酸鈣肥料', '5-266 鋅碳酸鎂肥料', '5-267 鋅碳酸鋅肥料', '5-268 鋅碳酸銅肥料',
  '5-269 鋅碳酸錳肥料', '5-270 鋅碳酸硼肥料', '5-271 鋅碳酸矽肥料', '5-272 鋅碳酸工業廢料肥料',
  '5-273 鋅碳酸高爐渣肥料', '5-274 鋅碳酸石灰肥料', '5-275 鋅碳酸石灰石肥料', '5-276 鋅碳酸石膏肥料',
  '5-277 鋅碳酸鈣肥料', '5-278 鋅碳酸鎂肥料', '5-279 鋅碳酸鋅肥料', '5-280 鋅碳酸銅肥料',
  '5-281 鋅碳酸錳肥料', '5-282 鋅碳酸硼肥料', '5-283 鋅碳酸矽肥料', '5-284 鋅碳酸工業廢料肥料',
  '5-285 鋅碳酸高爐渣肥料', '5-286 鋅碳酸石灰肥料', '5-287 鋅碳酸石灰石肥料', '5-288 鋅碳酸石膏肥料',
  '5-289 鋅碳酸鈣肥料', '5-290 鋅碳酸鎂肥料', '5-291 鋅碳酸鋅肥料', '5-292 鋅碳酸銅肥料',
  '5-293 鋅碳酸錳肥料', '5-294 鋅碳酸硼肥料', '5-295 鋅碳酸矽肥料', '5-296 鋅碳酸工業廢料肥料',
  '5-297 鋅碳酸高爐渣肥料', '5-298 鋅碳酸石灰肥料', '5-299 鋅碳酸石灰石肥料', '5-300 鋅碳酸石膏肥料',
  '6-01 銅肥料', '6-02 銅鎂肥料', '6-03 銅鈣肥料', '6-04 銅鋅肥料',
  '6-05 銅錳肥料', '6-06 銅硼肥料', '6-07 銅矽肥料', '6-08 銅工業廢料肥料',
  '6-09 銅高爐渣肥料', '6-10 銅石灰肥料', '6-11 銅石灰石肥料', '6-12 銅石膏肥料',
  '6-13 銅碳酸鈣肥料', '6-14 銅碳酸鎂肥料', '6-15 銅碳酸鋅肥料', '6-16 銅碳酸銅肥料',
  '6-17 銅碳酸錳肥料', '6-18 銅碳酸硼肥料', '6-19 銅碳酸矽肥料', '6-20 銅碳酸工業廢料肥料',
  '6-21 銅碳酸高爐渣肥料', '6-22 銅碳酸石灰肥料', '6-23 銅碳酸石灰石肥料', '6-24 銅碳酸石膏肥料',
  '6-25 銅碳酸鈣肥料', '6-26 銅碳酸鎂肥料', '6-27 銅碳酸鋅肥料', '6-28 銅碳酸銅肥料',
  '6-29 銅碳酸錳肥料', '6-30 銅碳酸硼肥料', '6-31 銅碳酸矽肥料', '6-32 銅碳酸工業廢料肥料',
  '6-33 銅碳酸高爐渣肥料', '6-34 銅碳酸石灰肥料', '6-35 銅碳酸石灰石肥料', '6-36 銅碳酸石膏肥料',
  '6-37 銅碳酸鈣肥料', '6-38 銅碳酸鎂肥料', '6-39 銅碳酸鋅肥料', '6-40 銅碳酸銅肥料',
  '6-41 銅碳酸錳肥料', '6-42 銅碳酸硼肥料', '6-43 銅碳酸矽肥料', '6-44 銅碳酸工業廢料肥料',
  '6-45 銅碳酸高爐渣肥料', '6-46 銅碳酸石灰肥料', '6-47 銅碳酸石灰石肥料', '6-48 銅碳酸石膏肥料',
  '6-49 銅碳酸鈣肥料', '6-50 銅碳酸鎂肥料', '6-51 銅碳酸鋅肥料', '6-52 銅碳酸銅肥料',
  '6-53 銅碳酸錳肥料', '6-54 銅碳酸硼肥料', '6-55 銅碳酸矽肥料', '6-56 銅碳酸工業廢料肥料',
  '6-57 銅碳酸高爐渣肥料', '6-58 銅碳酸石灰肥料', '6-59 銅碳酸石灰石肥料', '6-60 銅碳酸石膏肥料',
  '6-61 銅碳酸鈣肥料', '6-62 銅碳酸鎂肥料', '6-63 銅碳酸鋅肥料', '6-64 銅碳酸銅肥料',
  '6-65 銅碳酸錳肥料', '6-66 銅碳酸硼肥料', '6-67 銅碳酸矽肥料', '6-68 銅碳酸工業廢料肥料',
  '6-69 銅碳酸高爐渣肥料', '6-70 銅碳酸石灰肥料', '6-71 銅碳酸石灰石肥料', '6-72 銅碳酸石膏肥料',
  '6-73 銅碳酸鈣肥料', '6-74 銅碳酸鎂肥料', '6-75 銅碳酸鋅肥料', '6-76 銅碳酸銅肥料',
  '6-77 銅碳酸錳肥料', '6-78 銅碳酸硼肥料', '6-79 銅碳酸矽肥料', '6-80 銅碳酸工業廢料肥料',
  '6-81 銅碳酸高爐渣肥料', '6-82 銅碳酸石灰肥料', '6-83 銅碳酸石灰石肥料', '6-84 銅碳酸石膏肥料',
  '6-85 銅碳酸鈣肥料', '6-86 銅碳酸鎂肥料', '6-87 銅碳酸鋅肥料', '6-88 銅碳酸銅肥料',
  '6-89 銅碳酸錳肥料', '6-90 銅碳酸硼肥料', '6-91 銅碳酸矽肥料', '6-92 銅碳酸工業廢料肥料',
  '6-93 銅碳酸高爐渣肥料', '6-94 銅碳酸石灰肥料', '6-95 銅碳酸石灰石肥料', '6-96 銅碳酸石膏肥料',
  '6-97 銅碳酸鈣肥料', '6-98 銅碳酸鎂肥料', '6-99 銅碳酸鋅肥料', '6-100 銅碳酸銅肥料',
  '6-101 銅碳酸錳肥料', '6-102 銅碳酸硼肥料', '6-103 銅碳酸矽肥料', '6-104 銅碳酸工業廢料肥料',
  '6-105 銅碳酸高爐渣肥料', '6-106 銅碳酸石灰肥料', '6-107 銅碳酸石灰石肥料', '6-108 銅碳酸石膏肥料',
  '6-109 銅碳酸鈣肥料', '6-110 銅碳酸鎂肥料', '6-111 銅碳酸鋅肥料', '6-112 銅碳酸銅肥料',
  '6-113 銅碳酸錳肥料', '6-114 銅碳酸硼肥料', '6-115 銅碳酸矽肥料', '6-116 銅碳酸工業廢料肥料',
  '6-117 銅碳酸高爐渣肥料', '6-118 銅碳酸石灰肥料', '6-119 銅碳酸石灰石肥料', '6-120 銅碳酸石膏肥料',
  '6-121 銅碳酸鈣肥料', '6-122 銅碳酸鎂肥料', '6-123 銅碳酸鋅肥料', '6-124 銅碳酸銅肥料',
  '6-125 銅碳酸錳肥料', '6-126 銅碳酸硼肥料', '6-127 銅碳酸矽肥料', '6-128 銅碳酸工業廢料肥料',
  '6-129 銅碳酸高爐渣肥料', '6-130 銅碳酸石灰肥料', '6-131 銅碳酸石灰石肥料', '6-132 銅碳酸石膏肥料',
  '6-133 銅碳酸鈣肥料', '6-134 銅碳酸鎂肥料', '6-135 銅碳酸鋅肥料', '6-136 銅碳酸銅肥料',
  '6-137 銅碳酸錳肥料', '6-138 銅碳酸硼肥料', '6-139 銅碳酸矽肥料', '6-140 銅碳酸工業廢料肥料',
  '6-141 銅碳酸高爐渣肥料', '6-142 銅碳酸石灰肥料', '6-143 銅碳酸石灰石肥料', '6-144 銅碳酸石膏肥料',
  '6-145 銅碳酸鈣肥料', '6-146 銅碳酸鎂肥料', '6-147 銅碳酸鋅肥料', '6-148 銅碳酸銅肥料',
  '6-149 銅碳酸錳肥料', '6-150 銅碳酸硼肥料', '6-151 銅碳酸矽肥料', '6-152 銅碳酸工業廢料肥料',
  '6-153 銅碳酸高爐渣肥料', '6-154 銅碳酸石灰肥料', '6-155 銅碳酸石灰石肥料', '6-156 銅碳酸石膏肥料',
  '6-157 銅碳酸鈣肥料', '6-158 銅碳酸鎂肥料', '6-159 銅碳酸鋅肥料', '6-160 銅碳酸銅肥料',
  '6-161 銅碳酸錳肥料', '6-162 銅碳酸硼肥料', '6-163 銅碳酸矽肥料', '6-164 銅碳酸工業廢料肥料',
  '6-165 銅碳酸高爐渣肥料', '6-166 銅碳酸石灰肥料', '6-167 銅碳酸石灰石肥料', '6-168 銅碳酸石膏肥料',
  '6-169 銅碳酸鈣肥料', '6-170 銅碳酸鎂肥料', '6-171 銅碳酸鋅肥料', '6-172 銅碳酸銅肥料',
  '6-173 銅碳酸錳肥料', '6-174 銅碳酸硼肥料', '6-175 銅碳酸矽肥料', '6-176 銅碳酸工業廢料肥料',
  '6-177 銅碳酸高爐渣肥料', '6-178 銅碳酸石灰肥料', '6-179 銅碳酸石灰石肥料', '6-180 銅碳酸石膏肥料',
  '6-181 銅碳酸鈣肥料', '6-182 銅碳酸鎂肥料', '6-183 銅碳酸鋅肥料', '6-184 銅碳酸銅肥料',
  '6-185 銅碳酸錳肥料', '6-186 銅碳酸硼肥料', '6-187 銅碳酸矽肥料', '6-188 銅碳酸工業廢料肥料',
  '6-189 銅碳酸高爐渣肥料', '6-190 銅碳酸石灰肥料', '6-191 銅碳酸石灰石肥料', '6-192 銅碳酸石膏肥料',
  '6-193 銅碳酸鈣肥料', '6-194 銅碳酸鎂肥料', '6-195 銅碳酸鋅肥料', '6-196 銅碳酸銅肥料',
  '6-197 銅碳酸錳肥料', '6-198 銅碳酸硼肥料', '6-199 銅碳酸矽肥料', '6-200 銅碳酸工業廢料肥料',
  '6-201 銅碳酸高爐渣肥料', '6-202 銅碳酸石灰肥料', '6-203 銅碳酸石灰石肥料', '6-204 銅碳酸石膏肥料',
  '6-205 銅碳酸鈣肥料', '6-206 銅碳酸鎂肥料', '6-207 銅碳酸鋅肥料', '6-208 銅碳酸銅肥料',
  '6-209 銅碳酸錳肥料', '6-210 銅碳酸硼肥料', '6-211 銅碳酸矽肥料', '6-212 銅碳酸工業廢料肥料',
  '6-213 銅碳酸高爐渣肥料', '6-214 銅碳酸石灰肥料', '6-215 銅碳酸石灰石肥料', '6-216 銅碳酸石膏肥料',
  '6-217 銅碳酸鈣肥料', '6-218 銅碳酸鎂肥料', '6-219 銅碳酸鋅肥料', '6-220 銅碳酸銅肥料',
  '6-221 銅碳酸錳肥料', '6-222 銅碳酸硼肥料', '6-223 銅碳酸矽肥料', '6-224 銅碳酸工業廢料肥料',
  '6-225 銅碳酸高爐渣肥料', '6-226 銅碳酸石灰肥料', '6-227 銅碳酸石灰石肥料', '6-228 銅碳酸石膏肥料',
  '6-229 銅碳酸鈣肥料', '6-230 銅碳酸鎂肥料', '6-231 銅碳酸鋅肥料', '6-232 銅碳酸銅肥料',
  '6-233 銅碳酸錳肥料', '6-234 銅碳酸硼肥料', '6-235 銅碳酸矽肥料', '6-236 銅碳酸工業廢料肥料',
  '6-237 銅碳酸高爐渣肥料', '6-238 銅碳酸石灰肥料', '6-239 銅碳酸石灰石肥料', '6-240 銅碳酸石膏肥料',
  '6-241 銅碳酸鈣肥料', '6-242 銅碳酸鎂肥料', '6-243 銅碳酸鋅肥料', '6-244 銅碳酸銅肥料',
  '6-245 銅碳酸錳肥料', '6-246 銅碳酸硼肥料', '6-247 銅碳酸矽肥料', '6-248 銅碳酸工業廢料肥料',
  '6-249 銅碳酸高爐渣肥料', '6-250 銅碳酸石灰肥料', '6-251 銅碳酸石灰石肥料', '6-252 銅碳酸石膏肥料',
  '6-253 銅碳酸鈣肥料', '6-254 銅碳酸鎂肥料', '6-255 銅碳酸鋅肥料', '6-256 銅碳酸銅肥料',
  '6-257 銅碳酸錳肥料', '6-258 銅碳酸硼肥料', '6-259 銅碳酸矽肥料', '6-260 銅碳酸工業廢料肥料',
  '6-261 銅碳酸高爐渣肥料', '6-262 銅碳酸石灰肥料', '6-263 銅碳酸石灰石肥料', '6-264 銅碳酸石膏肥料',
  '6-265 銅碳酸鈣肥料', '6-266 銅碳酸鎂肥料', '6-267 銅碳酸鋅肥料', '6-268 銅碳酸銅肥料',
  '6-269 銅碳酸錳肥料', '6-270 銅碳酸硼肥料', '6-271 銅碳酸矽肥料', '6-272 銅碳酸工業廢料肥料',
  '6-273 銅碳酸高爐渣肥料', '6-274 銅碳酸石灰肥料', '6-275 銅碳酸石灰石肥料', '6-276 銅碳酸石膏肥料',
  '6-277 銅碳酸鈣肥料', '6-278 銅碳酸鎂肥料', '6-279 銅碳酸鋅肥料', '6-280 銅碳酸銅肥料',
  '6-281 銅碳酸錳肥料', '6-282 銅碳酸硼肥料', '6-283 銅碳酸矽肥料', '6-284 銅碳酸工業廢料肥料',
  '6-285 銅碳酸高爐渣肥料', '6-286 銅碳酸石灰肥料', '6-287 銅碳酸石灰石肥料', '6-288 銅碳酸石膏肥料',
  '6-289 銅碳酸鈣肥料', '6-290 銅碳酸鎂肥料', '6-291 銅碳酸鋅肥料', '6-292 銅碳酸銅肥料',
  '6-293 銅碳酸錳肥料', '6-294 銅碳酸硼肥料', '6-295 銅碳酸矽肥料', '6-296 銅碳酸工業廢料肥料',
  '6-297 銅碳酸高爐渣肥料', '6-298 銅碳酸石灰肥料', '6-299 銅碳酸石灰石肥料', '6-300 銅碳酸石膏肥料',
  '7-01 其他肥料', '7-02 其他複合肥料', '8-01 其他有機肥料', '8-02 其他有機複合肥料',
  '8-03 其他有機速效肥料', '8-04 其他有機液態肥料', '9-01 其他肥料類別'
]

const cropOptions = ['水稻', '葉菜類', '果樹', '茶葉', '花卉']

// 假資料
const product = ref({
  type: '有機肥料',
  brandName: '有機黃金A',
  companyName: '綠農有機肥料有限公司',
  registrationNo: '農肥製字第123456號',
  productCode: 'ORG-001',
  itemName: '1-01 黃腐酸肥料',
  property: '固態',
  crops: ['水稻', '果樹'],
  introSections: [
    { type: 'text', content: '本產品適合各類作物，促進生長。', imageUrl: '' },
    { type: 'image', content: '', imageUrl: '/placeholder-images-image_large.webp' }
  ],
  validDate: '2025-12-31',
  spec: '20kg/包',
  images: [
    { url: '/placeholder-images-image_large.webp' },
    { url: '/placeholder-images-image_large.webp' }
  ],
  productionRecords: ['https://example.com/record1', 'https://example.com/record2']
})

// 開始編輯
function startEdit() {
  editedProduct.value = JSON.parse(JSON.stringify(product.value))
  isEditing.value = true
}

// 儲存變更
function saveChanges() {
  if (editedProduct.value) {
    product.value = JSON.parse(JSON.stringify(editedProduct.value))
    isEditing.value = false
    console.log('商品已更新')
  }
}

// 取消編輯
function cancelEdit() {
  isEditing.value = false
  editedProduct.value = undefined
}

// 新增產品介紹段落
function addSection() {
  if (editedProduct.value) {
    editedProduct.value.introSections.push({ type: 'text', content: '', imageUrl: '' })
  }
}

// 移除產品介紹段落
function removeSection(idx: number) {
  if (editedProduct.value) {
    editedProduct.value.introSections.splice(idx, 1)
  }
}

// 新增產品圖片
function addImage() {
  if (editedProduct.value) {
    editedProduct.value.images.push({ url: '' })
  }
}

// 移除產品圖片
function removeImage(idx: number) {
  if (editedProduct.value) {
    editedProduct.value.images.splice(idx, 1)
  }
}

// 新增生產紀錄
function addProductionRecord() {
  if (editedProduct.value) {
    editedProduct.value.productionRecords.push('')
  }
}

// 移除生產紀錄
function removeProductionRecord(idx: number) {
  if (editedProduct.value) {
    editedProduct.value.productionRecords.splice(idx, 1)
  }
}
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(44, 62, 80, 0.08);
}
</style> 