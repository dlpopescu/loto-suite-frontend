<template>
  <div class="container" @keydown.enter="verificaBilet" tabindex="0">
    <!-- <div id="loading-overlay" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner-large"></div>
        <p>Scanning ...</p>
      </div>
    </div> -->    
    <table class="main-width" style="margin-top: 10px;">
      <tbody style="font-size: var(--font-size-regular);">
        <tr>
          <td colspan="5">
            <div style="text-align: left;display: flex;">
              <label class="switch-label">
                <span class="switch">
                  <input type="checkbox" v-model="useCache" />
                  <span class="slider"></span>
                </span>
                <span class="switch-text" :style="{fontWeight: useCache ? '700' : ''}">Use cache</span>
              </label>
              <button @click="stergeCache" style="font-family: 'Nunito'; margin-left: 10px;">
                Clear
              </button>      
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="6" style="text-align: center;font-weight: 600;color: var(--color-success-text);letter-spacing: 0.03em; ">Joc / Data tragere:</td>
        </tr>
        <tr>
          <td colspan="6"><GameSelect @game-changed="onGameChanged" /></td>
        </tr>
        <tr>
          <td colspan="6"><DateSelect @date-changed="onDateChanged" /></td>
        </tr>
        <tr>
          <td colspan="6" style="text-align: center;font-weight: 600;color: var(--color-success-text);letter-spacing: 0.03em; padding-top: 10px; ">Rezultate extragere:</td>
        </tr>
        <tr style="padding-top: 5px;" v-if="drawResult?.varianta">
          <td 
            v-for="(numar, idx) in drawResult.varianta.numere || []"  
            :key="`v${idx}`"
            align="center" 
            :style="{
              fontFamily: 'Fira Mono, monospace',
              fontWeight: '600',
              border: gameId === 'joker' && idx === (drawResult.varianta.numere.length - 1) ? '1px solid var(--color-joker)' : '1px solid var(--color-text-primary)',
              color: gameId === 'joker' && idx === (drawResult.varianta.numere.length - 1) ? 'var(--color-joker)' : 'var(--color-text-primary)'
            }">
            {{normalizeNumber(numar.numar)}}
          </td>
        </tr>
        <tr v-if="drawResult?.varianta_speciala && drawResult?.varianta_speciala.id != -1">
          <td 
            v-for="(numar, idx) in drawResult.varianta_speciala.numere || []" 
            :key="`vs${idx}`"
            align="center" 
            :style="{
              fontFamily: 'Fira Mono, monospace',
              fontWeight: '600',
              border: gameId === 'joker' && idx === (drawResult.varianta_speciala.numere.length - 1) ? '1px solid var(--color-joker)' : '1px solid teal',
              color: gameId === 'joker' && idx === (drawResult.varianta.numere.length - 1) ? 'var(--color-joker)' : 'teal'
            }">
            {{normalizeNumber(numar.numar)}}
          </td>
        </tr>
        <tr>
          <td 
            align="center" colspan="6" 
            :style="{
              fontFamily: 'Fira Mono, monospace',
              fontWeight: '600',
              border: '1px solid var(--color-text-primary)',
              color: 'var(--color-text-primary)',
              padding: '0.2em 1em'
            }">
            {{drawResult?.noroc?.numar || ''}}
          </td>
        </tr>
        <tr>
          <td style="text-align: center;font-weight: 600;color: var(--color-success-text);padding-top: 10px;letter-spacing: 0.03em; " colspan="6">Biletul tau:</td>
        </tr>
      </tbody>
    </table> 
    <Bilet
      class="main-width"
      style="margin-top: 1px;"
      :game="game"
      ref="biletRef"
      @noroc-changed="onNorocChanged"
      @sterge-bilet="stergeBilet"
      @verifica-bilet="verificaBilet"
    />  
    <!-- <div class="upload-section " style="margin-top: 20px;"> -->
      <!-- <input type="file" ref="fileInputRef" style="display:none" @change="onFileChange" />
      <button class="check-button" style="background: var(--color-main);" @click="onUploadClick()">
      {{ isUploading ? 'Scanare ...' : 'Scaneaza bilet' }}
      </button> -->
    <!-- </div> -->
    <Castiguri 
      v-if="(checkResult?.castiguri_total ?? 0) > 0"
      class="main-width"
      style="margin-top: 10px;"
      :castiguriVarianta="castiguriVarianta" 
      :castiguriVariantaSpeciala="castiguriVariantaSpeciala" 
      :castiguriNoroc="castiguriNoroc" 
      :norocGameName="`${game?.nume_noroc}`" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameSelect from './components/GameSelect.vue'
import DateSelect from './components/DateSelect.vue'
import Bilet from './components/Bilet.vue'
import Castiguri from './components/Castiguri.vue'
import { checkNumbers, getDrawResults, getGameById, /* scanTicket */ } from './api/client.js'
import { computed, onMounted, watch } from 'vue'

const biletRef = ref(null)
const gameId = ref('649')

const drawResult = ref(null);
const checkResult = ref(null);
// const scanResult = ref(null);
const game = ref(null);

const norocValue = ref('')

const castiguriVarianta = ref([])
const castiguriVariantaSpeciala = ref([])
const castiguriNoroc = ref([])

const drawDate = ref(new Date().toISOString().slice(0,10))
// const fileInputRef = ref(null);
// const isUploading = ref(false)
const useCache = ref(false)
const hasCastiguriNoroc = computed (() => castiguriNoroc.value && castiguriNoroc.value.some(c => c.win_count > 0));

// onMounted(async () => {
//   await fetchDrawResults();
// })

watch(gameId, async () => {
  if (biletRef.value) {
    biletRef.value.reset();
  }

  await fetchDrawResults();
})

watch(drawDate, async () => {
  await fetchDrawResults();
})

function stergeBilet() {
  checkResult.value = null;
  resetCastiguriToDefault();
}

function resetCastiguriToDefault() {
  if (castiguriVarianta.value.length > 0) {
    castiguriVarianta.value = castiguriVarianta.value.map(castig => ({
      ...castig,
      win_count: 0
    }));
  }
  
  if (castiguriVariantaSpeciala.value.length > 0) {
    castiguriVariantaSpeciala.value = castiguriVariantaSpeciala.value.map(castig => ({
      ...castig,
      win_count: 0
    }));
  }
  
  if (castiguriNoroc.value.length > 0) {
    castiguriNoroc.value = castiguriNoroc.value.map(castig => ({
      ...castig,
      win_count: 0
    }));
  }
}

async function verificaBilet() {
  console.log('Verifying ticket...');
  try {
    const selections = biletRef.value?.getSelections();
    const variants = selections?.variants || [];
    console.log('Variants to check:', variants);
    
    const formattedVariants = variants
      .filter(variant => variant.length > 1)
      .map((variant, index) => {
        let numbers = [...variant];
        
        if (gameId.value === 'joker') {
          const jokers = selections?.jokers || [];
          if (jokers[index] && jokers[index].length > 0){
            numbers.push(jokers[index][0]);
          }
        }
        
        return {
          id: index + 1,
          numere: numbers.map(num => ({ numar: num }))
        };
      });

    console.log('Formatted variants for checking:', formattedVariants);

    const result = await checkNumbers(
      gameId.value,
      formattedVariants,
      norocValue.value,
      drawDate.value,
      useCache.value
    );

    console.log('Check result:', result);

    castiguriVarianta.value = result.castiguri_varianta || []
    castiguriVariantaSpeciala.value = result.castiguri_varianta_speciala || []
    castiguriNoroc.value = result.castiguri_noroc || []

    const matching = [];
    const matchingJokers = [];

    if (result.variante_jucate && result.variante_jucate.length > 0) {
      result.variante_jucate.forEach((variant, variantIndex) => {
        const matchedNumbers = [];
        const matchedJokerNumbers = [];

        if (variant.numere && variant.numere.length > 0) {
          variant.numere.forEach((numar, index) => {
            if (numar.castigator) {
              if (gameId.value === 'joker') {
                const isJokerNumber = index === variant.numere.length - 1;
                if (isJokerNumber) {
                  matchedJokerNumbers.push(numar.numar);
                } else {
                  matchedNumbers.push(numar.numar);
                }
              } else {
                matchedNumbers.push(numar.numar);
              }
            }
          });
        }
        
        matching[variantIndex] = matchedNumbers;
        matchingJokers[variantIndex] = matchedJokerNumbers;
      });
    }

    if (biletRef.value) {
      biletRef.value.highlightNumbers(matching, matchingJokers);
      biletRef.value.setNorocCastigator(hasCastiguriNoroc.value);
    }

    checkResult.value = result;
  } catch (err) {
    console.error('error:', err.message || err)
  }
}

async function stergeCache() {
  try {
    await clearCache();
  } catch (err) {
    console.error('error:', err.message || err)
  }
}

// function onFileChange(e) {
//   const file = e.target.files[0];
//   if (!file) return;

//   isUploading.value = true;
//   const reader = new FileReader();
//   reader.onload = async function(event) {
//     const arrayBuffer = event.target.result;
//     try {
//       const result = await scanTicket(currentGameId.value, arrayBuffer);
//       scanResult.value = result;
//       norocValue.value = scanResult?.value.noroc?.numar || '';
//       console.log('Scan result:', result);
//     } catch (err) {
//       console.error('Failed to scan ticket:', err.message || err);
//     } finally {
//       isUploading.value = false;
//       e.target.value = '';
//     }
//   };

//   reader.readAsArrayBuffer(file);
// }

async function onGameChanged(selectedGameId) {
  gameId.value = selectedGameId;
  if (biletRef.value) {
    biletRef.value.reset();
  }

  // scanResult.value = null;
  await fetchDrawResults();
}

function onNorocChanged(value) {
  norocValue.value = value
}

async function onDateChanged(date) {
  drawDate.value = date;
  await fetchDrawResults();
}

async function fetchDrawResults() {
  if (!gameId.value || !drawDate.value) return;

  try {
    const result = await getDrawResults(gameId.value, drawDate.value, useCache.value);
    
    if (result.varianta && result.varianta.numere) {
      if (gameId.value === 'joker') {
        const mainNumbers = result.varianta.numere.slice(0, 5);
        const jokerNumber = result.varianta.numere.slice(5);
        mainNumbers.sort((a, b) => a.numar - b.numar);
        result.varianta.numere = [...mainNumbers, ...jokerNumber];
      } else {
        result.varianta.numere.sort((a, b) => a.numar - b.numar);
      }
    }
    
    if (result.varianta_speciala && result.varianta_speciala.numere) {
      if (gameId.value === 'joker') {
        const mainNumbers = result.varianta_speciala.numere.slice(0, 5);
        const jokerNumber = result.varianta_speciala.numere.slice(5);
        mainNumbers.sort((a, b) => a.numar - b.numar);
        result.varianta_speciala.numere = [...mainNumbers, ...jokerNumber];
      } else {
        result.varianta_speciala.numere.sort((a, b) => a.numar - b.numar);
      }
    }
    
    drawResult.value = result;

    const selectedGame = await getGameById(gameId.value);
    game.value = selectedGame;

  } catch (err) {
    console.error('Failed to fetch draw results:', err);
  }
}

// function onUploadClick() {
//   scanResult.value = null;
//   resetCheckStatus();
//   norocValue.value = '';
//   // await fetchDrawResults();

//   if (fileInputRef.value){
//     fileInputRef.value.click();
//   }
// }

function normalizeNumber(num) {
  return num < 10 ? '0' + num : num.toString()
}

</script>

<style scoped>

.upload-section {
  display: flex;
  gap: 1rem;
  align-items: start;
  margin-top: 1rem;
  justify-content: start;
  width: 100%;
  position: relative;
}
/* .upload-label {
  margin-bottom: 0;
}
.upload-button {
  display: inline-block;
  background: #2287c5;
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.2s;
}
.upload-button.uploading {
  background: #bfcfff;
  color: #444;
  cursor: wait;
}
.upload-spinner {
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 4px;
}
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #bfcfff;
  border-top: 3px solid #2287c5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
} */

.main-width {
  width: 100%;
  max-width: max-content;
  margin: 0 auto;
}

.container {
    width: fit-content;
    margin: 0 auto;
    overflow-x: auto;
    overflow-y: auto;
    padding: 10px;
    height: auto;
}
.switch-label {
  display: flex;
  align-items: center;
  gap: 10px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  vertical-align: middle;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 22px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-success-text);
}

input:checked + .slider:before {
  transform: translateX(18px);
}

.switch-text {
  font-size: var(--font-size-small);
  color: var(--color-text-primary);
}

</style>