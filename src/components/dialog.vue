<template>
  <div id="a">
    <div>
      <header>
        <slot name="header" header="user">这是头部</slot>
      </header>
      <main>
        <slot name="body" body="content">这是内容</slot>
      </main>
      <slot>数据为空</slot>
      <footer>
        <slot name="footer" footer="bottom">这是底部</slot>
      </footer>
    </div>
  </div>
</template>
